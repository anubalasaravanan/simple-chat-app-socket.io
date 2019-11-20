const express = require('express');
// var siofu = require("socketio-file-upload"); 
const app =express();
// var app = require('express')();
var http = require('http').createServer(app);
let fs = require('fs');
// let path = require('path');
const io = require('socket.io')(http);
const users = {};
// let fileName = __dirname + '/anu.jpg';
// let fileName = __dirname + '/readtxt.txt';
// let outputFileName = __dirname + '/output.png';

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
        let readStream;
        writeStream.write(img.photo, async function() {
            // Now the data has been written.
              console.log("Write completed.", img.imgName);
               readStream = await fs.createReadStream(img.imgName, {
                encoding: 'binary'
            }), chunks = [], delay = 0;
            // readStream.on('readable', () => {
            //     console.log('in readable');
            // })
            readStream.on('error', function(err) {
                console.log('err---', err);
            });
            readStream.on('data', (chunk) => {
                // console.log('chunk- read--', chunk.toString());
                chunks.push(chunk);
                console.log('image senttt', typeof(chunks));
                // socket.broadcast.emit('img-chunk', chunk);
            });
            readStream.on('end', () => {
                console.log('image loaded');
                socket.broadcast.emit('img-chunk', chunks);
            });
          });
      
          // Mark the end of file
        writeStream.end();
       
        // readStream.on('readable', () => {
            console.log('image nameee', img.imgName);
        // });
        
       
        // readStream.pipe(fs.createWriteStream('README_copy.txt')).on('data', (chunk) => {
       
    });
    socket.on('disconnect', function(){
        console.log('user disconnected');
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
      });
});

http.listen(5000, function () {
    console.log('app server started');
});
