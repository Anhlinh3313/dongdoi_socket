require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
const port = process.env.PORT;
const bodyParser = require('body-parser');
const Transactions = require("./database/entities/Transactions");

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const io = new Server(server, {
  maxHttpBufferSize: 1e8, // 100 MB
  cors: {
    origin: [
      "https://dongdoi.com",
      "https://admin.dongdoi.com",
      "https://api.dongdoi.com",
      "http://localhost:3039",
      "http://localhost:7771",
    ],
    methods: ["GET", "POST", "UPDATE", "DELETE", "PUT"],
  },
});

io.on("connection", async (socket) => {
  console.log("Connect: ", socket.id);

  socket.on("call_transaction", async (data) => {
    if(data){
      let transactions = await Transactions
      .find({ type: "in" })
      .sort({
          datetime: "desc",
      });
  
      if (transactions.length > 0) {
        socket.emit("transactions", transactions);
      }
    }
  });

  socket.on("disconnect", async () => {
    console.log("disconnect: ", socket.id);
    socket.disconnect();
  });

  console.log(io.sockets.server.engine.clientsCount);
});

const socketRouter = require('./routes/socketRouter')(io);
app.use('/api/transactionSocket', socketRouter);

server.listen(port, () => {
  console.log("Server listening on port " + port);
});
