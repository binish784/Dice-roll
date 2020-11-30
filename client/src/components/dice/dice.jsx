import * as PIXI from 'pixi.js';

import diceSpriteSheet from  "../../assets/dice.png";

const config = require("../../config/config.js");

class Dice {

    constructor(app,container){
        
        this.position = {
            x:config.dice.position.x,
            y:config.dice.position.y,
        }
        
        this.size ={
            height :config.dice.height,
            width : config.dice.width,
        }

        this.texture = null;
        this.body = null;

        this.baseTexture = null;
        this.spriteJson = {};

        this.app = app;
        this.container = container;

        this.initialize();
    }

    initialize = () => {
        this.app.loader.add("dice",diceSpriteSheet);
        this.app.loader.load(this.onTextureLoaded);
    }

    positionDice = (x,y) => {
        this.body.x = x;
        this.body.y = y;

    }
    
    onTextureLoaded = () =>{
        this.createSpriteSheet();
        this.createDice();
        // this.app.ticker.add(this.update);
    }

    createSpriteSheet = (e) =>{
        console.log("Resource");
        console.log(this.app.loader.resources["dice"])
        this.baseTexture = new PIXI.BaseTexture.from(this.app.loader.resources["dice"].url);
       
        this.baseTexture.setSize(736,414) // Original image size

        this.spriteJson["4"]= [
            new PIXI.Texture(this.baseTexture,new PIXI.Rectangle(0,0,this.size.width,this.size.height))
        ]

        this.spriteJson["roll"]=[];

        for (let i = 0 ; i < 16 ;i ++){
            let texture = new PIXI.Texture(this.baseTexture,new PIXI.Rectangle(i*this.size.width,1* this.size.height,this.size.width,this.size.height));
            this.spriteJson["roll"].push(texture);          
        }
    }

    createDice = () => {

        this.body = new PIXI.AnimatedSprite(this.spriteJson["roll"]);
        this.body.anchor.set(0.5);
        this.body.animationSpeed = .2;
        this.body.loop=true;
        this.body.height = this.size.height;
        this.body.width = this.size.width;
        
        this.positionDice(this.position.x,this.position.y);

        this.container.addChild(this.body);
        this.body.play();   
    }

    // update = () =>{
    //     console.log("a");
    // }

}

export default Dice;