var socket = io();
// removed arrow functions from client side to make it work on all browsers
socket.on('connect',function (){
  console.log('connected to server');
});
socket.on('disconnect',function(){
  console.log('disconnected from server');
});

socket.on('newMessage',function(message){ // server to client
  var formattedTime=moment(message.createdAt).format('LT');
  var template= jQuery('#message-template').html();
  var html= Mustache.render(template,{
    text: message.text,
    from : message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function(message){
    var formattedTime=moment(message.createdAt).format('LT');
    var locationTemplate= jQuery('#location-message-template').html();
    var html= Mustache.render(locationTemplate,{
      url: message.url,
      from : message.from,
      createdAt: formattedTime
    });
    jQuery('#messages').append(html);
});

jQuery('#message-form').on('submit',function(e){  //e for event
    e.preventDefault();

    var messageTextbox= jQuery('[name=message]');

    socket.emit('createMessage', {
      from: 'user' ,
      text : messageTextbox.val()
    }, function(){
      messageTextbox.val(''); //clearing the value in box
});
});


var locationButton = jQuery('#send-location');

locationButton.on('click', function(){
  if(!navigator.geolocation){
    return alert('geolocation not supported by your browser');
  }

locationButton.attr('disabled','disabled').text('sending location ...');// disabling send location button once it is clicked to stop spamming


  navigator.geolocation.getCurrentPosition(function (position){
      locationButton.removeAttr('disabled').text('send location');
      socket.emit('createLocationMeassage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
  }, function(){
    locationButton.removeAttr('disabled').text('send location');
    alert('unable to fetch location');
  });
});
