// server.js
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

/* =================== Set-Up MongoDB =================== */
const { MongoClient, ServerApiVersion } = require('mongodb');

const credentials = 'certification/X509-cert-3774797422904726191.pem'
const client = new MongoClient('mongodb+srv://clusterdbs.dirluav.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
  tlsCertificateKeyFile: credentials,
  serverApi: ServerApiVersion.v1
});
async function run() {
  try {
    await client.connect();
    const database = client.db("testDB");
    const collection = database.collection("testCol");
    const docCount = await collection.countDocuments({});
    console.log(docCount);
    // perform actions using client
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

/* =================== Set-Up Server =================== */
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});