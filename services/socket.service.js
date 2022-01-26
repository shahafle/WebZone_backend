const logger = require('./logger.service');

let gIo = null;
// const sharedRooms = {}

// *** Key Notes *** //
// - sharedRooms is an object held inside the gIo.
// - It will hold rooms where each room is an object like this : { wap.id : wap }
//   The key, will be the provided wap.id, which is also the room's name.
//   The value, will be the provided wap, so any user connected to the room will get the present-editing wap.

// connect on work-together :
// 1. A user works on a wap, clicks the "work-together" link.
// 2. The click emits an event to the server - telling it to join a room with the user's socket.id
// 3. The link to the room is copied to the user's clipboard which he can then send to anyone to connect to his room.
// 4. User #2 opens the link, and on 'connection' there should be a condition that connects him specificly to the provided room.
// 5. Any event fired by both users should be broadcasted ONLY in their room.

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
            if (!gIo.sharedRooms[socket.wapId]?.connectedUsers) delete gIo.sharedRooms[socket.wapId];
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
            // "Stick" a label on the socket (a.k.a connect it to a room)
            socket.join(wap.id);
            // Save the joined room on the socket for our convinience
            socket.wapId = wap.id;

            console.log(gIo.sharedRooms);
            console.log(socket.wapId);
        })

        // User opened the link he got from the other user :
        socket.on('join-room', wap => {

            socket.join(wap.id); // wap.id will be the room's name (the editor page that the inviting socket is currently working on)
            socket.wapId = wap.id;
        })

        // socket.on('mouse-move', data => {
        // console.log(data);
        // 
        // socket.broadcast.emit('show-mouse', data);
        // })

    })

}



// function connectSockets(http, session) {
//     gIo = require('socket.io')(http, {
//         cors: {
//             origin: '*',
//         }
//     })
//     gIo.on('connection', socket => {
//         if(!gIo.sharedRooms) gIo.sharedRooms = {}
//         console.log('New socket', socket.id)
//         socket.on('disconnect', socket => {
//             console.log('Someone disconnected')
//             gIo.sharedRooms[socket.wapId].connectedUsers--
//             if(!gIo.sharedRooms[socket.wapId].connectedUsers) delete gIo.sharedRooms[socket.wapId]
//         })
//         socket.on('create room', wap => {
//             if (socket.wap.Id === wap.Id) return;

//             if (socket.wap.Id) {
//                 socket.leave(socket.wap.id)
//             }

//             if(gIo.sharedRooms[wap.id]) gIo.sharedRooms[wap.Id] = {wap, connectedUsers: 1}
//             socket.join(wap.Id)
//             socket.wapId = wap.Id
//         })

//         socket.on('join room', wapId => {
//             if (socket.wapId === wapId) return;

//             if (socket.wapId) {
//                 socket.leave(socket.wapId)
//             }

//             socket.join(wapId)
//             socket.wapId = wapId
//             gIo.sharedRooms[wapId].connectedUsers++
//             socket.to(wapId).emit('first connect', gIo.sharedRooms[wapId])
//         })

//         socket.on('update wap', wap => {
//             gIo.sharedRooms[wap.id] = wap
//             socket.to(wap.id).emit('updated wap', wap)
//         })


module.exports = {
    connectSockets
}