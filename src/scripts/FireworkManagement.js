import { Firework } from "./Firework";
import * as PIXI from "pixi.js";
import * as particles from 'pixi-particles'
import { Globals } from "./Globals";

export class FireworkManagement{
    constructor(container,app){
        let doc = "src/tests/fireworks2.xml";
        this.container = container;
        this.app = app;
        let xmlContent = '';
        let fireworksXML = [];
        this.fireworks =[];
        this.fireworkDuration = 0;
        fetch(doc).then((response)=>{
            response.text().then((xml)=>{
                xmlContent = xml
                let parser = new DOMParser();
                let xmlDOM = parser.parseFromString(xmlContent, 'application/xml');
                fireworksXML = xmlDOM.querySelectorAll('Firework');
                let i = 0;
                fireworksXML.forEach(fireworkNode=>{ 
                    i++;  
                    let firework = new Firework(fireworkNode,container);
                    if(firework.correctData == 1){
                        this.fireworks.push(firework);
                    }else if (firework.correctData == -1){
                        console.error("Firework nº " + i + " not added - begin must be a number")
                    }else if (firework.correctData == -2){
                        console.error("Firework nº " + i + " not added - type must be 'Fountain' or 'Rocket'")
                    }else if (firework.correctData == -3){
                        console.error("Firework nº " + i + " not added - color must exist")
                    }else if (firework.correctData == -4){
                        console.error("Firework nº " + i + " not added - duration must be a number")
                    }else if (firework.correctData == -5){
                        console.error("Firework nº " + i + " not added - position must exist and be a number")
                    }else if (firework.correctData == -6){
                        console.error("Firework nº " + i + " not added - velocity must exist and be a number for a rocket")
                    }        
                })
            }).then(()=>{
                this.fireworks.forEach(firework=>{
                    firework.setPosition(this.app.renderer.width,this.app.renderer.height);
                })
                
                this.fireworkDuration = this.calculateFireworkDuration();
                this.startFireworks();
                this.fireworkLoop();
                
            })
        })
     }

    calculateFireworkDuration(){
        var fireworkDuration = 0;
        this.fireworks.forEach(firework => {
            if(firework.duration + firework.begin >fireworkDuration){
                fireworkDuration = firework.duration + firework.begin;
            }
        });
        return fireworkDuration;
    }

    fireworkLoop(){
        var delayBetweenFireworks = 2000;
        var timeToReplayFireworks = delayBetweenFireworks+ this.fireworkDuration;
        var timePassedLoop = 0;
        PIXI.Ticker.shared.add(() => { 
            timePassedLoop += PIXI.Ticker.shared.elapsedMS;
            if(timeToReplayFireworks <= timePassedLoop ){
                timePassedLoop = 0;
                this.startFireworks();
            }
        });
    };

    startFireworks(){
        this.fireworks.forEach(firework=>{
            firework.spawnFirework();
        })
    }
}
