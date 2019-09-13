const express = require('express');
const app =express();
// var app = require('express')();
var http = require('http').createServer(app);

const io = require('socket.io')(http);

app.get('/', (req, res) => {
    console.log('hello');

    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('New connection');
    socket.on('disconnect', function(){
        console.log('user disconnected');
      });
    socket.on('chat-from-client', (chat) => {
        console.log('chat msg from client------', chat);
        // io.emit('chat message', chat); -----broadcast to all including sender

        socket.broadcast.emit('chat-from-server', chat);  // ----broadcast to all except sender
    });
});

http.listen(3000, function () {
    console.log('server started');
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