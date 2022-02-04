const logger = require('./logger.service');
const { getRandomColor } = require('./util.service');

let gIo = null;

// *** Key Notes *** //
// - sharedRooms is an object held inside the gIo.
// - It will hold rooms where each room is an object like this : { wap.id (socket room): { wap, connectedUsers: 1, cursors: [{id,color,nickname}...] }
// - The key, will be the provided wap.id, which is also the room's name.
// - The value, will be the provided wap, so any user connected to the room will get the present-editing wap.

// Example :
// let gIo = {
//     ...,
//     sharedRooms: { 
//         'k2j34h5tk'(wap.id): {
//             wap: {...},
//             connectedUsers: 2,
//             cursors: [{socket1},{socket2}]
//         }
//     }
// }


function connectSockets(http, session) {

    gIo = require('socket.io')(http, {
        cors: {
            origin: '*'
        }
    })

    gIo.on('connection', socket => {
        console.log('user connected', socket.id);

        socket.on('disconnect', () => {
            console.log('user disconnected');

            // If user was connected to a room
            if (socket.wapId) {
                socket.to(socket.wapId).emit('remove-cursor', socket.id);
                gIo.sharedRooms[socket.wapId].connectedUsers--;
                // Delete room if empty after user disconnection
                if (!gIo?.sharedRooms[socket.wapId]?.connectedUsers) delete gIo.sharedRooms[socket.wapId];
            }
        })

        socket.on('force-disconnect', () => {
            socket.disconnect();
        })

        socket.on('create-room', data => {
            const { wap, nickname } = data;
            // Initialize sharedRooms
            if (!gIo.sharedRooms) gIo.sharedRooms = {};
            // If room is already created
            if (socket.wapId === wap.id) return;

            // If user was connected to another room
            if (socket.wapId) {
                socket.leave(socket.wapId);
            }

            // Initialize room
            if (!gIo.sharedRooms[wap.id]) gIo.sharedRooms[wap.id] = { wap, connectedUsers: 1, cursors: [{ id: socket.id, nickname }] };

            socket.join(wap.id);
            socket.wapId = wap.id;
            socket.color = getRandomColor();
            socket.nickname = nickname;
        })

        socket.on('join-room', data => {
            const { wapId, nickname } = data;
            if (!gIo.sharedRooms) return;
            if (!gIo?.sharedRooms[wapId]) return;
            if (socket.wapId === wapId) return;

            if (socket.wapId) {
                socket.leave(socket.wapId);
            }

            socket.join(wapId);
            socket.wapId = wapId;
            socket.color = getRandomColor();
            socket.nickname = nickname;

            const room = gIo.sharedRooms[wapId];

            room.connectedUsers++;
            room.cursors.push({ id: socket.id, nickname });

            socket.emit('load-wap', room.wap);
        })

        socket.on('update-wap', wap => {
            if (!gIo.sharedRooms) return;
            if (!gIo.sharedRooms[wap.id]) return;

            // Update wap in sharedRooms and for everyone else in the room
            gIo.sharedRooms[wap.id].wap = wap;
            socket.to(wap.id).emit('wap-updated', wap);
        })

        socket.on('mouse-move', pos => {
            if (!socket.wapId) return;

            // Update user's cursor position for everyone else in the room
            socket.to(socket.wapId).emit('mouse-moved', { id: socket.id, pos, color: socket.color, nickname: socket.nickname });
        })
    })
}


module.exports = {
    connectSockets
}