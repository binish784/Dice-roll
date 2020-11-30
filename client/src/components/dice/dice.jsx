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
    }

    createSpriteSheet = (e) =>{

        this.baseTexture = new PIXI.BaseTexture.from(this.app.loader.resources["dice"].url);
       
        this.baseTexture.setSize(736,414) // Original image size

        this.spriteJson["stable"]=[
            new PIXI.Texture(this.baseTexture,new PIXI.Rectangle(0 * this.size.width, 4 * this.size.height,this.size.width,this.size.height)),
            new PIXI.Texture(this.baseTexture,new PIXI.Rectangle(4 * this.size.width, 4 * this.size.height,this.size.width,this.size.height)),
            new PIXI.Texture(this.baseTexture,new PIXI.Rectangle(0 , 8 * this.size.height , this.size.width,this.size.height)),
            new PIXI.Texture(this.baseTexture,new PIXI.Rectangle(0,0,this.size.width,this.size.height)),
            new PIXI.Texture(this.baseTexture,new PIXI.Rectangle(12*this.size.width,4*this.size.height,this.size.width,this.size.height)),
            new PIXI.Texture(this.baseTexture,new PIXI.Rectangle(8*this.size.width,4 * this.size.height,this.size.width,this.size.height))
        ]

        this.spriteJson["roll"]=[];

        for (let i = 0 ; i < 16 ;i ++){
            let texture = new PIXI.Texture(this.baseTexture,new PIXI.Rectangle(i*this.size.width,1* this.size.height,this.size.width,this.size.height));
            this.spriteJson["roll"].push(texture);          
        }
    }

    createDice = () => {
        this.stableSprite(2,this.position.x,this.position.y);
        this.body.interactive=true;
        this.body.on("click",(e)=>{this.handleClick(e)});
    }

    handleClick = (e) => {
        console.log("Roll dice");
    }


    stableSprite = (number,x,y) =>{
        this.body = new PIXI.Sprite(this.spriteJson["stable"][number-1]);
        this.body.height = this.size.height;
        this.body.width = this.size.width;
        this.positionDice(x,y);

        this.container.addChild(this.body);
        
    }

    animatedSprite = () =>{
        this.body = new PIXI.AnimatedSprite(this.spriteJson["stable"][2]);
        this.body.anchor.set(0.5);
        this.body.animationSpeed = .2;
        this.body.loop=false;
        this.body.height = this.size.height;
        this.body.width = this.size.width;
        
        this.positionDice(this.position.x,this.position.y);

        this.container.addChild(this.body);
        this.body.play();   
    }

    update = () =>{
        // console.log("a");
    }

}

export default Dice;