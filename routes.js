'use strict';

let userRoutes      = require('./app/routes/user.routes.js');
let adminRoutes     = require('./app/routes/admin.user.routes');

module.exports = (app, io) => {
    app.use('/api/v1/user', userRoutes);
    app.use('/api/v1/admin/manage-users', adminRoutes);

    app.get('/api/v1/io', (req, res) => {
        res.sendFile(__dirname + '/chat-demo.html');
    });
    
    var name;

    io.on('connection', (socket) => {
        socket.on('joining msg', (username) => {
            name = username;
            console.log(`---${name} joined the chat---`);
            io.emit('chat message', `---${name} joined the chat---`);
        });
        
        socket.on('disconnect', () => {
            console.log(`---${name} left the chat---`);
            io.emit('chat message', `---${name} left the chat---`);
        });
        socket.on('chat message', (msg) => {
            socket.broadcast.emit('chat message', msg); //sending message to all except the sender
        });
    });
}