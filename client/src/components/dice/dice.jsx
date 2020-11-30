
import * as PIXI from 'pixi.js';

import diceSpriteSheet from  "../../assets/dice.png";
// import { dice } from '../../config/config.js';
 
import {getRandom} from "../../utils/randomNumber.js";

const config = require("../../config/config.js");
const STATES = require("../../config/diceStates.js");
const DICE = require("../../config/stableStates.js");


class Dice{

    constructor(app,container,onDiceRolled){

        this.onDiceRolled = onDiceRolled;

        this.size ={
            height :config.dice.height,
            width : config.dice.width,
        }

        this.state = STATES.STABLE;

        this.speedConst = {
            x:3,
            y:3,
        }

        this.maxSpeed = {
            x:3,
            y:3,
        }
        
        this.spritePosition = {
            x:0,
            y:0
        }        

        this.texture = null;

        this.body = null;

        this.baseTexture = null;
        this.spriteJson = {};

        this.app = app;
        this.container = container;

        this.diceValue = 0;

        this.initialize();          // initialize dice
    }

    initialize = () => {
        this.app.loader.add("dice",diceSpriteSheet);
        this.app.loader.load(this.onTextureLoaded);
    }

    onTextureLoaded = () =>{
        this.createSpriteSheet();           // create sprite sheet
        this.createDice();              // create dice
    }

    createSpriteSheet = (e) =>{

        this.baseTexture = new PIXI.BaseTexture.from(this.app.loader.resources["dice"].url);
        this.baseTexture.setSize(736,414) // Original image size

        // stable faces sprites
        this.spriteJson["stable"]=[
            new PIXI.Texture(this.baseTexture,new PIXI.Rectangle(DICE["1"].x * this.size.width, DICE["1"].y * this.size.height,this.size.width,this.size.height)),
            new PIXI.Texture(this.baseTexture,new PIXI.Rectangle(DICE["2"].x * this.size.width, DICE["2"].y * this.size.height,this.size.width,this.size.height)),
            new PIXI.Texture(this.baseTexture,new PIXI.Rectangle(DICE["3"].x , DICE["3"].y * this.size.height , this.size.width,this.size.height)),
            new PIXI.Texture(this.baseTexture,new PIXI.Rectangle(DICE["4"].x , DICE["4"].y ,this.size.width,this.size.height)),
            new PIXI.Texture(this.baseTexture,new PIXI.Rectangle(DICE["5"].x * this.size.width, DICE["5"].y * this.size.height,this.size.width,this.size.height)),
            new PIXI.Texture(this.baseTexture,new PIXI.Rectangle(DICE["6"].x * this.size.width,DICE["6"].y * this.size.height,this.size.width,this.size.height))
        ]

    }

    createDice = () => {
        
        let startFace = getRandom(1,6);        //start with a random face
        this.diceValue = startFace;     // initial dice value

        this.spritePosition = DICE[startFace.toString()];   // face sprite position in sprite sheet


        // initial face
        this.animatedSprite(
            [this.spriteJson["stable"][startFace-1]],
            config.dice.position.x,config.dice.position.y
        ); 
        this.body.interactive=true; // make the sprite interactive for registering events
        this.body.on("click",(e)=>{this.handleClick(e)});   // click event listener
    }
    

    // on Click listener for the dice
    handleClick = (e) => {

        // check if dice is not already in rolling state
        if( this.state === STATES.ROLLING ) return;

        this.state = STATES.ROLLING;    // change the state to rolling

        // this.direction = getRandom(1,4);  // set a random direction to roll
        this.maxSpeed.x = getRandom(-Math.abs(this.speedConst.x),Math.abs(this.speedConst.x));
        this.maxSpeed.y = getRandom(-Math.abs(this.speedConst.y),Math.abs(this.speedConst.y));

        let spriteAnimations = this.generateSpriteAnimation(this.direction);    // get directional spritesheet frames
        this.body.textures = spriteAnimations;  // set the frames for the dice
        this.body.play(); // play the animation

    }

    // move the position of the dice
    positionDice = (x,y) => {
        this.body.x = x;
        this.body.y = y;
    }

    finishedRolling = () =>{

        if(this.state===STATES.ROLLING){
            this.state = STATES.STABLE;
            this.onDiceRolled(this.diceValue);
        }
    }

    generateSpriteAnimation = () =>{
        let frames = [];

        for (let i = 0 ; i < 30 ;i ++){
            let y = getRandom(1,7);
            let x = getRandom(0,15);
            let texture = new PIXI.Texture(this.baseTexture,new PIXI.Rectangle(x*this.size.width,y* this.size.height,this.size.width,this.size.height));
            frames.push(texture);          
        }   
        let stable = getRandom(0,5);
        frames.push(this.spriteJson["stable"][stable.toString()]);
        this.diceValue = stable+1;
        return frames;
    }

    getSprite = (x,y) =>{
        x = Math.abs(x) % 15;
        y = Math.abs(y) % 8;

        if(y==0){
            return new PIXI.Texture(this.baseTexture,new PIXI.Rectangle(0, 0,this.size.width,this.size.height));
        }
        
        if(y==8){
            return new PIXI.Texture(this.baseTexture,new PIXI.Rectangle(0, 8 * this.size.height,this.size.width,this.size.height));
        }

        let targetSprite = new PIXI.Texture(this.baseTexture,new PIXI.Rectangle(x * this.size.width, y * this.size.height,this.size.width,this.size.height));
        return targetSprite;
    }
    
    stableSprite = (number,x,y) =>{
        this.body = new PIXI.Sprite(this.spriteJson["stable"][number-1]);
        this.body.height = this.size.height;
        this.body.anchor.set(1);
        this.body.width = this.size.width;
        this.positionDice(x,y);
        this.app.stage.addChild(this.body);
    }

    animatedSprite = (frames,x,y) =>{
        this.body = new PIXI.AnimatedSprite(frames);
        this.body.anchor.set(0.5);
        this.body.animationSpeed = 0.3;
        this.body.loop=false;
        this.body.height = this.size.height;
        this.body.width = this.size.width;
        this.body.onComplete  = (e)=> this.finishedRolling();
        
        this.positionDice(x,y);

        this.app.stage.addChild(this.body);
        this.body.play();   
    }

    detectCollision = () => {
        let diceBody = this.body.getBounds();
        if(diceBody.x <= 0 || diceBody.x + diceBody.width >= config.canvas.width){
            this.maxSpeed.x=-this.maxSpeed.x;
        }
        if(diceBody.y <= 0 || diceBody.y + diceBody.height >= config.canvas.height){
            this.maxSpeed.y=-this.maxSpeed.y;
        }

    }

    update = () =>{
        if(this.body==null) return;         // ensure the body is not null
        
        if(this.state !== STATES.ROLLING)  return;          // ensure the dice is in not stable state

        this.detectCollision();

        let x = this.body.x + this.maxSpeed.x;
        let y = this.body.y + this.maxSpeed.y;
        
        this.positionDice(x,y);         // change the dice position
        
        return;
    }

}

export default Dice;