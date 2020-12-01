const express = require("express");
const app = express();
const cors = require('cors');

const http = require("http").createServer();

const PORT  = process.env.PORT ||  5000;

const utils = require("./utils/shuffle.js");

const io = require("socket.io")(http, {
    cors: {
        origin: '*',
    }
});

app.use(cors());

var outcomes = require("./config/outcomes.js");

io.on("connection",(socket)=>{

    // shuffle the possible outcomes
    outcomes = utils.shuffle(outcomes);    
    
    socket.on("diceRolled",(data)=>{
        
        let outcome = outcomes[data.value-1];
        socket.emit("outcomeSend",{outcome : outcome});
    
    })
})


http.listen(PORT,()=>{
    console.log("SERVER RUNNING ON PORT : "+ PORT );
})

