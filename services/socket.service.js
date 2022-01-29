const logger = require('./logger.service');
const {getRandomColor} = require('./util.service');

let gIo = null;

// *** Key Notes *** //
// - sharedRooms is an object held inside the gIo.
// - It will hold rooms where each room is an object like this : { wap.id (socket room): { wap, connectedUsers: 1, cursors: [socketIds...] }
//   The key, will be the provided wap.id, which is also the room's name.
//   The value, will be the provided wap, so any user connected to the room will get the present-editing wap.

// Example :
// let gIo = {
//     ...,
//     sharedRooms: { 
//         '35k1jasf'(socketId): {
//             wap: {...},
//             connectedUsers: 2,
//             cursors: ['socket.id_1','socket.id_2']
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
            
            if (socket.wapId){
                socket.to(socket.wapId).emit('remove-cursor', socket.id);
                gIo.sharedRooms[socket.wapId].connectedUsers--;
                if (!gIo?.sharedRooms[socket.wapId]?.connectedUsers) delete gIo.sharedRooms[socket.wapId];
            } 
        })
        
        socket.on('force-disconnect', () => {
            socket.disconnect();
        })

        socket.on('create-room', wap => {
            if (!gIo.sharedRooms) gIo.sharedRooms = {};
            if (socket.wapId === wap.id) return;

            if (socket.wapId) {
                socket.leave(socket.wapId);
            }

            if (!gIo.sharedRooms[wap.id]) gIo.sharedRooms[wap.id] = { wap, connectedUsers: 1, cursors: [socket.id] };

            socket.join(wap.id);
            socket.wapId = wap.id;
            socket.color = getRandomColor();
        })

        socket.on('join-room', wapId => {
            if (!gIo.sharedRooms) return;
            if (!gIo?.sharedRooms[wapId]) return;
            if (socket.wapId === wapId) return;

            if (socket.wapId) {
                socket.leave(socket.wapId);
            }

            socket.join(wapId);
            socket.wapId = wapId;
            socket.color = getRandomColor();

           const room =  gIo.sharedRooms[wapId];

           room.connectedUsers++;
           room.cursors.push(socket.id); // each cursor is a string of the socket's id
            
            socket.emit('load-wap',room.wap);
        })

        socket.on('update-wap', wap => {
            if (!gIo.sharedRooms) return;
            if (!gIo.sharedRooms[wap.id]) return;

            gIo.sharedRooms[wap.id].wap = wap;
            socket.to(wap.id).emit('wap-updated', wap);
        })

        socket.on('mouse-move', pos => {
            if (!socket.wapId) return;

            socket.to(socket.wapId).emit('mouse-moved', { id: socket.id, pos, color: socket.color });
        })
    })
}


module.exports = {
    connectSockets
}