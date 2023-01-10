// const express=require('express')
// const app=express()
// const mongoose=require('mongoose')
// const morgan=require('morgan')
// const bodyParser=require('body-parser')
// const cors = require('cors');
// const http = require('http');
// const WebSocket = require('ws');

// const port = 6969;
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server })

// const UserRoute=require('./route/UserRoute');
// const WordRoute=require('./route/WordRoute');

// mongoose.set('strictQuery', false);
// mongoose.connect("mongodb://127.0.0.1:27017/pictionary", { useNewUrlParser: true });
// const db=mongoose.connection

// db.on('error',(err)=>{
//     console.log(err);
// });

// db.once('open',()=>{
//     console.log('database connection estabilished');
// });


// app.use(cors());

// app.use(morgan('dev'))

// app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


// app.use('/api/user',UserRoute)
// app.use('/api/word',WordRoute)



//     const PORT=process.env.PORT || 3000

//     if (db) {
//         app.listen(PORT,()=>{
//             console.log('server is running on port ' + PORT)
//         });

//         wss.on('connection', function connection(ws) {
//             ws.on('message', function incoming(data) {
//             wss.clients.forEach(function each(client) {
//                 if (client !== ws && client.readyState === WebSocket.OPEN) {
//                 client.send(data);
//                 }
//             })
//             })
//         })


//       server.listen(port, function() {
//         console.log(`Server is listening on ${port}`)
//       })


//     }

     // ws.on('message', (message) => {
        //   console.log(`Received message: ${message}`);
        //   const data = JSON.parse(message);
        //   // Broadcast the message to all clients
        //   wss.clients.forEach((client) => {
        //     if (client !== ws && client.readyState === WebSocket.OPEN) {
        //       client.send(JSON.stringify(data));
        //     }
        //   });
        // });


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

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/pictionary", { useNewUrlParser: true });
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

// Set up the WebSocket server for the chat functionality
const wssChat = new WebSocket.Server({ server });

// Set up the WebSocket server for the drawing functionality
const wssDrawing = new WebSocket.Server({ port: 8080 });

// Maintain a list of all connected clients for the chat functionality
let chatClients = [];

// Maintain a list of all connected clients for the drawing functionality
let drawingClients = [];

// Listen for incoming connections for the chat functionality
wssChat.on('connection', (ws) => {
  console.log('New connection established - chat');

  // Add the new client to the list
  chatClients.push(ws);

  // Listen for messages from the client
  ws.on('message', (data) => {
    // Broadcast the received data to all connected clients
    chatClients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  // Remove the client from the list when the connection is closed
  ws.on('close', () => {
    chatClients = chatClients.filter((client) => client !== ws);
  });
});

// Listen for incoming connections for the drawing functionality
wssDrawing.on('connection', (ws) => {
  console.log('New connection established - drawing');

  // Add the new client to the list
  drawingClients.push(ws);

  // Listen for messages from the client
  ws.on('message', (data) => {
    // Broadcast the received data to all connected clients
    drawingClients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        console.log('inside server draw'+ data)
        client.send(data);
      }
    });
  });

  // Remove the client from the list when the connection is closed
  ws.on('close', () => {
    drawingClients = drawingClients.filter((client) => client !== ws);
  });
});

// Start the server
server.listen(6969, () => {
  console.log('Server is listening on 6969');
});


