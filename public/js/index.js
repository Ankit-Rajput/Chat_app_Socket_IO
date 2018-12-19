var socket = io();
// removed arrow functions from client side to make it work on all browsers
socket.on('connect',function (){
  console.log('connected to server');

  socket.emit('createMessage', {
    from: 'ankit',
    text: 'You are fired!!'

  });
});
socket.on('disconnect',function(){
  console.log('disconnected from server');
});

socket.on('newMessage',function(message){ // server to client
  console.log('New message',message);
});
