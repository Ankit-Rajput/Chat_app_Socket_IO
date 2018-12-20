//npm i socket.io --save
const http = require('http');
const path = require('path'); //inbuilt
const socketIO = require('socket.io');
const publicPath= path.join(__dirname, '../public');// path for public  dir
//can be done directly __dirname/../public
const express= require('express');
const app = express();
const port = process.env.PORT || 3000;
const{generateMessage} = require('./utils/message');


var server= http.createServer(app);

var io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('new user connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to Chat app')); // server to client

    socket.broadcast.emit('newMessage',generateMessage('Admin', 'New user joined'));


    socket.on('createMessage', (message,callback)=>{
      console.log('createMessage',message);
      io.emit('newMessage',generateMessage(message.from, message.text));
      // socket.broadcast.emit('newMessage',{
      //   from: message.from,
      //   text: message.text,
      //   createdAt: new Date().getTime()
      // });
      callback('this is from server ');
    });

    socket.on('disconnect',()=>{
      console.log('user disconnected');
      });
});

server.listen(port,()=>{
  console.log( `server is up on port: ${port}`);
});










//socket.emit for a single connection
// io.emit for all connections
// socket.broadcast.emit for all connection leaving the one who sent
