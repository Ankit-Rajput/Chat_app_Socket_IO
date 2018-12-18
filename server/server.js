const path = require('path'); //inbuilt

const publicPath= path.join(__dirname, '../public');// path for public  dir
//can be done directly __dirname/../public
const express= require('express');
const app = express();

const port = process.env.PORT || 3000;


app.use(express.static(publicPath));
//
// app.get('/',(req,res)=>{
//     res.render('index.html');
// });
// automatically rendered index.html

app.listen(port,()=>{
  console.log( `server is up on port: ${port}`);
});
