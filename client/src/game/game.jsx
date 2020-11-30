import React,{Component} from 'react';

import * as PIXI from 'pixi.js';

import Dice from '../components/dice/dice.jsx';

import io from 'socket.io-client';
      
const config = require("../config/config.js");
const socketConfig = require("../config/socket.js");

const socket = io(socketConfig.endPoint);
  
class Game extends Component { 
    
    constructor(props){
    
        super(props);
        
        this.pxRender = React.createRef();
        this.app = null;
        this.container = null;

        this.dice = null;

        this.controller = null;

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

        this.app.stage.addChild(this.container);

        this.dice = new Dice(this.app,this.container,this.onDiceRolled.bind(this));

        this.app.ticker.add(this.updateGame);
        
    }
    
    componentDidMount(){

        console.log(socket);
        this.pxRender.current.appendChild(this.app.view);
    }

    onDiceRolled = (diceValue) =>{
        console.log("DICE ROLLED GAME : " + diceValue);
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