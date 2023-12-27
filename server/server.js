// server.js
const express = require('express');
const http = require('http');
const runMongoDB = require('./mongodb');
const setupSocket = require('./socket');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

/* =================== Set-Up MongoDB =================== */
runMongoDB().catch(console.dir);

/* =================== Set-Up Socket.io =================== */
app.use(cors());
setupSocket(server);

/* =================== Set-Up Server =================== */
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
