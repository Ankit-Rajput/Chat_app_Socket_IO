var socket = io();
// removed arrow functions from client side to make it work on all browsers
socket.on('connect',function (){
  console.log('connected to server');

  socket.emit('createEmail', {
    to: 'mira@ex.com',
    text: 'You are fired!!'

  });
});
socket.on('disconnect',function(){
  console.log('disconnected from server');
});

socket.on('newEmail',function(email){ // server to client
  console.log('New Email',email);
});
