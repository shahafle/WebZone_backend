const logger = require('./logger.service');
const {getRandomColor} = require('./util.service');

let gIo = null;

// *** Key Notes *** //
// - sharedRooms is an object held inside the gIo.
// - It will hold rooms where each room is an object like this : { wap.id : { wap, connectedUsers: 1 }
//   The key, will be the provided wap.id, which is also the room's name.
//   The value, will be the provided wap, so any user connected to the room will get the present-editing wap.

// example : 
// let gIoooo = {
//     sharedRooms: { 
//         '35k1jasf': {
//             wap: {},
//             connectedUsers: 1,
//             cursors: ['socket.id_1']
//         }
//     }
// }

let gIoooooo = {
    sharedRooms: { 
        '35k1jasf': {
            wap: {},
            connectedUsers: 2,
            cursors: ['socket.id_1','socket.id_2']
        }
    }
}


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
            
            if (socket.wapId) gIo.sharedRooms[socket.wapId].connectedUsers--;
            if (socket.wapId) {
                if (!gIo?.sharedRooms[socket.wapId]?.connectedUsers) delete gIo.sharedRooms[socket.wapId];
            }
            
            if (socket.wapId) socket.to(socket.wapId).emit('remove-cursor', socket.id);
        })
        
        socket.on('force-disconnect', () => {
            socket.to(socket.wapId).emit('remove-cursor', socket.id);
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

            if (socket.wapId === wapId) return;

            if (socket.wapId) {
                socket.leave(socket.wapId);
            }

            socket.join(wapId);
            socket.wapId = wapId;
            socket.color = getRandomColor();

            gIo.sharedRooms[wapId].connectedUsers++;
            gIo.sharedRooms[wapId].cursors.push(socket.id); // each cursor is a string of the socket's id
            
            socket.emit('load-wap', gIo.sharedRooms[wapId].wap);
        })

        socket.on('update-wap', wap => {

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











// function connectSockets(http, session) {

//     gIo = require('socket.io')(http, {
//         cors: {
//             origin: '*'
//         }
//     })

//     // gIo refers to ALL of our sockets
//     gIo.on('connection', socket => {
//         console.log('user connected', socket.id);

//         socket.on('disconnect', socket => {
//             console.log('user disconnected');

//             // If the user was connected to a room, update the connectedUsers count.
//             if (socket.wapId) gIo.sharedRooms[socket.wapId].connectedUsers--;
//             // If the room has 0 connected users left, remove it.
//             if (socket.wapId) {
//                 if (!gIo?.sharedRooms[socket.wapId]?.connectedUsers) delete gIo.sharedRooms[socket.wapId];
//             }
//         })

//         // User clicked on "Work Together" link :
//         socket.on('create-room', wap => {

//             // Create  sharedRooms if it didn't exist.
//             if (!gIo.sharedRooms) gIo.sharedRooms = {};

//             // If the user is already in that room (has a wapId "sticker") return, no need to reconnect.
//             if (socket.wapId === wap.id) return;

//             // Leave whatever room you were in
//             if (socket.wapId) {
//                 socket.leave(socket.wapId);
//             }

//             // Join the room provided with the wap.id
//             // If the room didnt exist, create it
//             if (!gIo.sharedRooms[wap.id]) gIo.sharedRooms[wap.id] = { wap, connectedUsers: 1 };

//             // "Stick" a label on the socket (a.k.a connect it to a room)
//             socket.join(wap.id);
//             // Save the joined room on the socket for our convinience
//             socket.wapId = wap.id;

//         })

//         // User opened the link he got from the other user :
//         socket.on('join-room', wapId => {

//             // If the user is already in that room (has a wapId "sticker") return, no need to reconnect
//             if (socket.wapId === wapId) return;

//             // Leave whatever room you were in
//             if (socket.wapId) {
//                 socket.leave(socket.wapId);
//             }

//             // "Stick" a label on the socket (a.k.a connect it to a room)
//             socket.join(wapId);
//             // Save the joined room on the socket for our convinience
//             socket.wapId = wapId;

//             gIo.sharedRooms[wapId].connectedUsers++;
            
//             // Send the wap
//             socket.emit('load-wap', gIo.sharedRooms[wapId].wap);

//             socket.to(wapId).emit('add-cursor', socket.id);
//         })


//         socket.on('update-wap', wap => {

//             // Update the room's wap :
//             gIo.sharedRooms[wap.id].wap = wap;
//             // Update to all users except the sender :
//             socket.to(wap.id).emit('wap-updated', wap);
//         })


//         socket.on('mouse-move', pos => {
//             if (!socket.wapId) return;
//             socket.to(socket.wapId).emit('mouse-moved', pos);
//         })
        
//     })
// }