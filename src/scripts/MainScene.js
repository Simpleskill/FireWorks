import * as PIXI from "pixi.js";
import { Globals } from "./Globals";
import { FireworkManagement } from "./FireworkManagement";

export class MainScene{
    constructor(){
        this.container = new PIXI.Container({});
        this.createBackground();
    }

    createBackground(){
        this.bg = new PIXI.Sprite(Globals.resources["nightbg"].texture);
        this.container.addChild(this.bg);
        this.bg.width = 1920;
        this.bg.height = 1080;
        // this.bg.width = window.innerWidth;
        // this.bg.height = window.innerHeight;
    }

    startFireWork(app){
        this.fireworkManagement = new FireworkManagement(this.container,app);
    }
}