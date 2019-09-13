const io = require('socket.io')(3000);

io.on('connection', socket => {
    console.log('A new user is connected');
    // socket.emit('chat', (chat) => {
    //     console.log('chat msg is', chat);
    // });
    socket.emit('start-chat', 'hello');
    socket.on('chat-from-client', chat =>{
        console.log('client said----', chat);
        socket.broadcast.emit('chat-from-server', chat);
    })
});
console.log('server started');