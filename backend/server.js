const express = require("express");
const app = express();

const cors = require('cors');

const http = require("http").createServer();

const io = require("socket.io")(http, {
    cors: {
        origin: '*',
    }
});

const PORT  = process.env.PORT ||  5000;

app.use(cors());

io.on("connection",(socket)=>{

    console.log("New Client connected to socket");

    socket.emit("welcome","Hello There client");

})


http.listen(PORT,()=>{
    console.log("SERVER RUNNING ON PORT : "+ PORT );
})

