const express = require('express');
const app =express();
// var app = require('express')();
var http = require('http').createServer(app);

const io = require('socket.io')(http);
const users = {};

app.get('/', (req, res) => {
    console.log('hello');

    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('New connection');
   
    socket.on('chat-from-client', (chat) => {
        console.log('chat msg from client------', chat);
        // io.emit('chat message', chat); -----broadcast to all including sender
        socket.broadcast.emit('chat-from-server', {
            chat: chat,
            name: users[socket.id] 
        });  // ----broadcast to all except sender
    });
    socket.on('new-user', (name) => {
        users[socket.id] = name;
        console.log('new name', name);
        socket.broadcast.emit('user-connected', name);
    });
    socket.on('disconnect', function(){
        console.log('user disconnected');
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
      });
});

http.listen(3000, function () {
    console.log('app server started');
});


// var app = require('express')();
// var http = require('http').createServer(app);
// var io = require('socket.io')(http);

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

// io.on('connection', function(socket){
//   console.log('a user connected');
// });

// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });