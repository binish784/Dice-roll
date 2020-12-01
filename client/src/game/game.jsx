import React,{Component} from 'react';

import * as PIXI from 'pixi.js';

import Dice from '../components/dice/dice.jsx';
import io from 'socket.io-client';
      
const config = require("../config/config.js");

const socketConfig = require("../config/socket.js");

class Game extends Component { 
    
    constructor(props){
    
        super(props);
        
        this.pxRender = React.createRef();
        this.app = null;
        this.container = null;

        this.dice = null;

        this.controller = null;

        this.socket = null;

        this.state = {
            showText :  " Click on the dice to Roll ",
        }

        this.textComponent = null;

        this.initialize();
    }

    initialize(){
        this.app = new PIXI.Application(
            {
                width:config.canvas.width,
                height:config.canvas.height,
                backgroundColor:config.canvas.backgroundColor
            }
        )
        
        this.container = new PIXI.Container();

        this.textComponent = new PIXI.Text(this.state.showText,{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});

        this.app.stage.addChild(this.textComponent);

        this.app.stage.addChild(this.container);

        this.dice = new Dice(this.app,this.container,this.onDiceRolled.bind(this));

        this.socket = io(socketConfig.endPoint);

        this.app.ticker.add(this.updateGame);
        
    }
    
    componentDidMount(){

        this.pxRender.current.appendChild(this.app.view);
    }

    onDiceRolled = async (diceValue) =>{
        console.log("GAME STARTED : " + diceValue);

        this.socket.on("outcomeSend",(data)=>{

            this.textComponent.text= data.outcome;

        })
  
        this.socket.emit("diceRolled",{value:diceValue})
        
    }

    // Main game Loop
    updateGame=()=>{
        if(this.dice==null) return;

        this.dice.update();
    }

    render(){
        return <>
            <div ref={this.pxRender} id="pxRender"/>
        </>
    }

}

export default Game;