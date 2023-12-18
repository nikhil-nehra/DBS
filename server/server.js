// server.js
const express = require('express');
const http = require('http');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { Server } = require('socket.io');
const cors = require('cors');
const { emit } = require('process');

const app = express();
const server = http.createServer(app);

/* =================== Set-Up MongoDB =================== */
const credentials = 'certification/X509-cert-3774797422904726191.pem'
const client = new MongoClient('mongodb+srv://clusterdbs.dirluav.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
  tlsCertificateKeyFile: credentials,
  serverApi: ServerApiVersion.v1
});
async function run() {
  try {
    await client.connect();
    const database = client.db('testDB');
    const collection = database.collection('testCol');
    const docCount = await collection.countDocuments({});
    console.log(`Database is connected with ${docCount} documents`);
    // perform actions using client
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

/* =================== Set-Up Socket.io =================== */
app.use(cors())

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

let users = [];

const messages = {
  general: [],
  notSilly: [],
  silly: [],
  minecraft: [],
};

io.on('connection', (socket) => {

  socket.on('join_server', (username) => {
    const user = {
      username,
      id: socket.id,
    };
    users.push(user);
    io.emit('new_user', users);
    console.log(users)
  });

  socket.on('join_room', (roomName, callBack) => {
    socket.join(roomName);
    callBack(messages[roomName]);
  })

  socket.on('send_message', ({ content, roomNumber, sender, chatName, isChannel }) => {
    if (isChannel) {
      const payload = {
        content,
        chatName,
        sender,
      };
      socket.to(roomNumber).emit('new_message', payload);
    } else {
      const payload = {
        content,
        chatName: sender,
        sender,
      };
      socket.to(roomNumber).emit('new_message', payload);
    }
    
    if (messages[chatName]) {
      messages[chatName].push({
        sender,
        content,
      });
    }
  });

  socket.on('disconnect', () => {
    users = users.filter(u => u.id !== socket.id);
    io.emit('new_user', users)
  });
})

/* =================== Set-Up Server =================== */
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
