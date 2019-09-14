
  const socket = io();

  const messageContainer = document.getElementById('message-container');
  const messageForm = document.getElementById('form-container');
  const message = document.getElementById('message');
  
  socket.on('chat-from-server', (chat) => {
      console.log('received msg', chat);
      appendMessage(chat);
  });
  messageForm.addEventListener('submit', e => {
    message1 = message.value
    console.log('message---', message1);
      e.preventDefault();
      socket.emit('chat-from-client', message1);
      message.value='';
  });
  
  function appendMessage (message) {
      const messageElement = document.createElement('div');
      messageElement.innerText = message;
      messageContainer.append(messageElement);
  };