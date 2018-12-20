var socket = io();
// removed arrow functions from client side to make it work on all browsers
socket.on('connect',function (){
  console.log('connected to server');

  // socket.emit('createMessage', {
  //   from : 'ankit',
  //   text: 'You are fired!!'
  //
  // });
});
socket.on('disconnect',function(){
  console.log('disconnected from server');
});

socket.on('newMessage',function(message){ // server to client
  console.log('New message',message);

  var li = jQuery('<li></li>');
  li.text(`${message.from} : ${message.text}`);

  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
    var li = jQuery('<li></li>');
    var a= jQuery('<a target="_blank">My current Location</a>');

    li.text(`${message.from}: `);
    a.attr('href',message.url);
    li.append(a);
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit',function(e){  //e for event
    e.preventDefault();

    socket.emit('createMessage', {
      from: 'user' ,
      text : jQuery('[name=message]').val()
    }, function(){
      // console.log("Got it" , data);
});
});


var locationButton = jQuery('#send-location');

locationButton.on('click', function(){
  if(!navigator.geolocation){
    return alert('geolocation not supported by your browser');
  }

  navigator.geolocation.getCurrentPosition(function (position){
      socket.emit('createLocationMeassage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
  }, function(){
    alert('unable to fetch request');
  });
});
