//npm i socket.io --save
const http = require('http');
const path = require('path'); //inbuilt
const socketIO = require('socket.io');
const publicPath= path.join(__dirname, '../public');// path for public  dir
//can be done directly __dirname/../public
const express= require('express');
const app = express();

const port = process.env.PORT || 3000;

var server= http.createServer(app);

var io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('new user connected');

    // socket.emit('newMessage', { // server to client
    //   from: 'no_one',
    //   text: 'hello no one',
    //   createdAt: 123
    // });

    socket.on('createMessage', (message)=>{
      console.log('createMessage',message);
      io.emit('newMessage',{
        from: message.from,
        text: message.text,
        createdAt: new Date().getTime()
      });
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
