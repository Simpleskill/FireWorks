import * as PIXI from "pixi.js";
import { Globals } from "./Globals";
import TWEEN from "@tweenjs/tween.js";
import * as particles from 'pixi-particles'

export class Firework{
    
    constructor(firework,container){
        this.correctData = 1;
        this.container = container;
        this.begin = parseInt(firework.getAttribute("begin"));
        if(isNaN(this.begin)){
            this.correctData = -1;
            return;
        }
        this.type = firework.getAttribute("type");
        if(this.type.toLowerCase() !== "fountain" && this.type.toLowerCase() !== "rocket" ){
            this.correctData = -2;
            return;
        }
        this.colour = firework.getAttribute("colour");
        if(this.colour==undefined){
            this.correctData = -3;
            return;
        }
        this.duration = parseInt(firework.getAttribute("duration"));

        if(isNaN(this.duration)){
            this.correctData = -4;
            return;
        }

        this.position = firework.children[0];
        if(this.position!== undefined){
            this.x = parseInt(this.position.getAttribute("x"));
            this.y = parseInt(this.position.getAttribute("y"));
            if(isNaN(this.x)||isNaN(this.y)){
                this.correctData = -5
                return;
            }
        }else{
            this.correctData = -5;
            return;
        }

        this.velocity = firework.children[1];
        if(this.velocity!== undefined){
            this.xSpeed = parseInt(this.velocity.getAttribute("x"));
            this.ySpeed = parseInt(this.velocity.getAttribute("y"));
            if(isNaN(this.xSpeed)||isNaN(this.ySpeed)){
                this.correctData = -6
                return;
            }
        }else if(this.type == "Rocket"){
            this.correctData = -6;
            return;
        }

        this.sprite = new PIXI.Sprite(Globals.resources[this.type.toLowerCase()].texture);
        this.sprite.anchor.set(0.5);
        this.sprite.colour=this.colour;
        this.sprite.tint = this.colour;
        this.sprite.x = 0;
        this.sprite.y = 0; 
        this.destinationX = 0;
        this.destinationY = 0;
                
    }

    calculateRocketDestination(){
        this.destinationX = this.sprite.x - (this.xSpeed*(this.duration/1000));
        this.destinationY = this.sprite.y - (this.ySpeed*(this.duration/1000));
    }

    spawnFirework(){
        this.sprite.x = parseInt(this.x);
        this.sprite.y = parseInt(this.y);
        var timePassed = 0;
        var secondsPassed = 0;
        var rocketStarted = false;
        var rocketStoped = false;
        var restart = true;
        PIXI.Ticker.shared.add(() => { 
            if(restart){
                timePassed += PIXI.Ticker.shared.elapsedMS;
                secondsPassed = timePassed * 0.001;
                if (!rocketStarted && timePassed>=this.begin){
                    rocketStarted = true;
                    this.container.addChild(this.sprite); 
                    if(this.type == "Fountain"){
                        this.fountainHandler(this.container);
                    }else if (this.type == "Rocket"){
                        this.rocketHandler(this.container);
                    }
                }
                
                if (rocketStarted && !rocketStoped && timePassed>=(this.duration+this.begin)){
                    this.container.removeChild(this.sprite)
                    timePassed = 0;
                    secondsPassed = 0;
                    rocketStarted = false;
                    rocketStoped = false;
                    restart = false;
                }
            }
            
        })
    }

    setPosition(canvasWidth,canvasHeight){
        this.sprite.x = (canvasWidth/2) - parseInt(this.x);
        this.x = this.sprite.x;
        this.sprite.y = (canvasHeight/2) - parseInt(this.y); 
        this.y = this.sprite.y;
        if(this.type == "Rocket"){
            this.calculateRocketDestination();
        }
    }
    fountainHandler(container){
        var emitter = new particles.Emitter(
            container,
            [Globals.resources['particle'].texture],
            {
                alpha: {
                    list: [
                        {
                            value: 0.8,
                            time: 0
                        },
                        {
                            value: 0.1,
                            time: 1
                        }
                    ],
                    isStepped: false
                },
                scale: {
                    list: [
                        {
                            value: 0.8,
                            time: 0
                        },
                        {
                            value: 0.3,
                            time: 1
                        }
                    ],
                    isStepped: false
                },
                color: {
                    list: [
                        {
                            value: this.colour,
                            time: 0
                        },
                        {
                            value: this.colour,
                            time: 1
                        }
                    ],
                    isStepped: false
                },
                speed: {
                    list: [
                        {
                            value: 400,
                            time: 0
                        },
                        {
                            value: 200,
                            time: 1
                        }
                    ],
                    isStepped: false
                },
                startRotation: {
                    min: 240,
                    max: 300
                },
                rotationSpeed: {
                    min: 0,
                    max: 0
                },
                lifetime: {
                    min: 0.5,
                    max: 1.5
                },
                frequency: 0.008,
                spawnChance: 1,
                particlesPerWave: 2,
                emitterLifetime: this.duration*0.001,
                maxParticles: 1000,
                pos: {
                    x: this.sprite.x,
                    y: this.sprite.y
                },
                addAtBack: false,
                spawnType: "circle",
                spawnCircle: {
                    x: 0,
                    y: 0,
                    r: 10
                }
            }
        );
        emitter.playOnceAndDestroy();
        
    }

    rocketHandler(container){
        function animate(time) {
            requestAnimationFrame(animate)
            TWEEN.update(time)
        }
        requestAnimationFrame(animate)
        var coords = {x: this.sprite.x, y: this.sprite.y}
        var tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
            .to({x: this.destinationX, y: this.destinationY}, this.duration) 
            .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
            .onUpdate(() => {
                this.sprite.x = coords.x;
                this.sprite.y = coords.y;
            })
            .onComplete(() =>{
                var emitter = new particles.Emitter(
                    container,
                    [Globals.resources['particle'].texture],
                    {
                        alpha: {
                            list: [
                                {
                                    value: 0.8,
                                    time: 0
                                },
                                {
                                    value: 0.1,
                                    time: 1
                                }
                            ],
                            isStepped: false
                        },
                        scale: {
                            list: [
                                {
                                    value: 0.8,
                                    time: 0
                                },
                                {
                                    value: 0.3,
                                    time: 1
                                }
                            ],
                            isStepped: false
                        },
                        color: {
                            list: [
                                {
                                    value: this.colour,
                                    time: 0
                                },
                                {
                                    value: this.colour,
                                    time: 1
                                }
                            ],
                            isStepped: false
                        },
                        speed: {
                            list: [
                                {
                                    value: 400,
                                    time: 0
                                },
                                {
                                    value: 200,
                                    time: 1
                                }
                            ],
                            isStepped: false
                        },
                        startRotation: {
                            min: 0,
                            max: 360
                        },
                        rotationSpeed: {
                            min: 0,
                            max: 0
                        },
                        lifetime: {
                            min: 0.5,
                            max: 1.5
                        },
                        frequency: 0.008,
                        spawnChance: 1,
                        particlesPerWave: 2,
                        emitterLifetime: 0.31,
                        maxParticles: 1000,
                        pos: {
                            x: this.sprite.x,
                            y: this.sprite.y
                        },
                        addAtBack: false,
                        spawnType: "circle",
                        spawnCircle: {
                            x: 0,
                            y: 0,
                            r: 10
                        }
                    }
                );
                emitter.playOnceAndDestroy();
                
                
            })
            .start() // Start the tween immediately.
            
    }
}
