//npm i socket.io --save
const http = require('http');
const path = require('path'); //inbuilt

const socketIO = require('socket.io');
const publicPath= path.join(__dirname, '../public');// path for public  dir
//can be done directly __dirname/../public
const express= require('express');
const app = express();
const port = process.env.PORT || 3000;
const{generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString}=require ('./utils/validation.js');
const {Users}= require('./utils/users');
var server= http.createServer(app);

var io = socketIO(server);
var users= new Users();



app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('new user connected');


    socket.on('join',(params,callback)=>{
      if(!isRealString(params.name) || !isRealString(params.room)){
        return callback(' Name and room name required');
      }
        socket.join(params.room);
        //socket.leave(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to Chat app')); // server to client
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin', `${params.name} joined`));

        callback();

    });


    socket.on('createMessage', (message,callback)=>{
      var user= users.getUser(socket.id);

      if(user && isRealString(message.text)){
        io.to(user.room).emit('newMessage',generateMessage(user.name, message.text));
      }

      callback();
    });

    socket.on('createLocationMeassage',(coords)=>{
      var user= users.getUser(socket.id);
        if(user){
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
      }
    });

    socket.on('disconnect',()=>{
      var user= users.removeUser(socket.id);

      if(user){
        io.to(user.room).emit('updateUserList',users.getUserList(user.room));
        io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} has left`));
      }
      });
});

server.listen(port,()=>{
  console.log( `server is up on port: ${port}`);
});






//socket.emit for a single connection
// io.emit for all connections
// socket.broadcast.emit for all connection leaving the one who sent
