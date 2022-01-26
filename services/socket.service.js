const logger = require('./logger.service');

let gIo = null;

// *** Key Notes *** //
// - sharedRooms is an object held inside the gIo.
// - It will hold rooms where each room is an object like this : { wap.id : { wap, connectedUsers: 1 }
//   The key, will be the provided wap.id, which is also the room's name.
//   The value, will be the provided wap, so any user connected to the room will get the present-editing wap.

// example : 
// let gIo = {
//     sharedRooms: { 
//         '35k1jasf': {
//             wap: {},
//             connectedUsers: 1
//         }
//     }
// }


function connectSockets(http, session) {

    gIo = require('socket.io')(http, {
        cors: {
            origin: '*'
        }
    })

    // gIo refers to ALL of our sockets
    gIo.on('connection', socket => {
        console.log('user connected', socket.id);

        socket.on('disconnect', socket => {
            console.log('user disconnected');

            // If the user was connected to a room, update the connectedUsers count.
            if (socket.wapId) gIo.sharedRooms[socket.wapId].connectedUsers--;
            // If the room has 0 connected users left, remove it.
            if (socket.wapId) {
                if (!gIo?.sharedRooms[socket.wapId]?.connectedUsers) delete gIo.sharedRooms[socket.wapId];
            }
        })

        // User clicked on "Work Together" link :
        socket.on('create-room', wap => {

            // Create  sharedRooms if it didn't exist.
            if (!gIo.sharedRooms) gIo.sharedRooms = {};

            // If the user is already in that room (has a wapId "sticker") return, no need to reconnect.
            if (socket.wapId === wap.id) return;

            // Leave whatever room you were in
            if (socket.wapId) {
                socket.leave(socket.wapId);
            }

            // Join the room provided with the wap.id
            // If the room didnt exist, create it
            if (!gIo.sharedRooms[wap.id]) gIo.sharedRooms[wap.id] = { wap, connectedUsers: 1 };
            console.log('ln 58 :',gIo.sharedRooms)

            // "Stick" a label on the socket (a.k.a connect it to a room)
            socket.join(wap.id);
            // Save the joined room on the socket for our convinience
            socket.wapId = wap.id;

        })

        // User opened the link he got from the other user :
        socket.on('join-room', wapId => {

            // If the user is already in that room (has a wapId "sticker") return, no need to reconnect
            if (socket.wapId === wapId) return;
            
            // Leave whatever room you were in
            if (socket.wapId) {
                socket.leave(socket.wapId);
            }
            
            // "Stick" a label on the socket (a.k.a connect it to a room)
            socket.join(wapId);
            // Save the joined room on the socket for our convinience
            socket.wapId = wapId;
            
            gIo.sharedRooms[wapId].connectedUsers++;
            console.log('ln 86 :', gIo.sharedRooms[wapId].connectedUsers);
        })


        socket.on('update-wap', wap => {

            // Update the room's wap :
            gIo.sharedRooms[wap.id].wap = wap;
            // Update to all users except the sender :
            socket.to(wap.id).emit('wap-updated', wap);
        })

    })

}


module.exports = {
    connectSockets
}