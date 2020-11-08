const express = require('express');
// var siofu = require("socketio-file-upload"); 
const app = express();
// var app = require('express')();
var http = require('http').createServer(app);
let fs = require('fs');
// let path = require('path');
const io = require('socket.io')(http);
const users = {};


app.get('/', (req, res) => {
    console.log('hello');

    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('New connection');

    socket.on('chat-from-client', (chat) => {
        // io.emit('chat message', chat); -----broadcast to all including sender
        socket.broadcast.emit('chat-from-server', {
            chat: chat.message,
            name: users[socket.id],
            id: socket.id
        });  // ----broadcast to all except sender
    });
    socket.on('typing', (typingValue) => {
        socket.broadcast.emit('typing', {
            typingValue: typingValue,
            user: users[socket.id]
        });
    })
    socket.on('new-user', (name) => {
        users[socket.id] = name;
        console.log('new name', name);
        socket.broadcast.emit('user-connected', name);
    });
    socket.on('image-upload-from-client', async (img) => {
        console.log('captured image', img);
        var writeStream = await fs.createWriteStream(img.imgName);
        writeStream.write(img.photo, async function () {
            img.src = 'data:image/jpeg;base64,' + img.photo.buffer;
            socket.broadcast.emit('image-from-server', { image: true, buffer: img.photo.toString('base64') });
        });
        writeStream.end();
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });
});

http.listen(5000, function () {
    console.log('app server started');
});
