import * as PIXI from "pixi.js";
import TWEEN from "@tweenjs/tween.js";
import { Loader } from "./Loader";
import { MainScene } from "./MainScene";

export class App{
    run(){

        // create canvas
        this.GFX_ScreenWidth = 1024
        this.GFX_ScreenHeight = 768
        //this.app = new PIXI.Application({width: this.GFX_ScreenWidth, height: this.GFX_ScreenHeight, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,});
        this.app = new PIXI.Application({resizeTo: window});
        
        document.body.appendChild(this.app.view);
        
        // load sprites
        this.loader = new Loader(this.app.loader);
        this.loader.preload().then(()=> this.start());
    }
    start(){

        this.scene = new MainScene();
        this.app.stage.addChild(this.scene.container);

        this.app.ticker.add(() =>{
            TWEEN.update();
        });
        
        this.scene.container.x =this.app.screen.width /2;
        this.scene.container.y =this.app.screen.height / 2;

        this.scene.container.pivot.set(this.app.screen.width / 2,this.app.screen.height / 2);

        this.scene.startFireWork(this.app);

    }
}

