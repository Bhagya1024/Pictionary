
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const mongoose=require('mongoose')
const morgan=require('morgan')
const bodyParser=require('body-parser')


const UserRoute=require('./route/UserRoute');
const WordRoute=require('./route/WordRoute');
const RoomRoute=require('./route/RoomRoute');
const UserRoomRoute=require('./route/UserRoomRoute');
const GameRoute=require('./route/GameRoute');
// Set up the Express app and HTTP server
const app = express();
const server = http.createServer(app);

app.use(cors());

app.use(morgan('dev'))

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.use('/api/user',UserRoute)
app.use('/api/word',WordRoute)
app.use('/api/room',RoomRoute)
app.use('/api/userroom',UserRoomRoute)
app.use('/api/game',GameRoute)

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://pictionary:mongopic1234@cluster0.t9adv99.mongodb.net/pictionary?retryWrites=true&w=majority", { useNewUrlParser: true });
const db=mongoose.connection

db.on('error',(err)=>{
    console.log(err);
});

db.once('open',()=>{
    console.log('database connection estabilished');
});

    const PORT=process.env.PORT || 3000
    app.listen(PORT,()=>{
    console.log('server is running on port ' + PORT)
    });


const wssChat = new WebSocket.Server({ server });


let chatClients = [];

let drawingClients = [];

// Listen for incoming connections for the chat functionality
wssChat.on('connection', (ws, req) => {
  let roomId = req.url.slice(1);
  console.log('New connection established - chat' + roomId);
  ws.roomId = roomId;

  chatClients.push(ws);

  ws.on('message', (data) => {
    chatClients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN && client.roomId === ws.roomId) {
        client.send(data);
      }
    });
  });

  ws.on('close', () => {
    chatClients = chatClients.filter((client) => client !== ws);
  });
});

const wssDrawing = new WebSocket.Server({ port: 8080 });


server.listen(6969, () => {
  console.log('Server is listening on 6969');
});

