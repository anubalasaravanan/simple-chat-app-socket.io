const socket = io('http://localhost:3000');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('form-container');
const message = document.getElementById('message').value;

socket.on('chat', (chat) => {
    console.log('received msg', chat);
    appendMessage(chat);
});
messageForm.addEventListener('submit', e => {
    e.preventDefault();
    socket.emit('chat-from-client', message);
    message.value='';
});

function appendMessage (message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
};