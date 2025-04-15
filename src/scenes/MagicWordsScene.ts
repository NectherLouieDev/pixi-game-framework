import { Scene } from "@core/Scene";
import { BasicText } from "@px/BasicText";
import { InteractiveText } from "@px/InteractiveText";
import gsap from "gsap";

export class MagicWordsScene extends Scene
{
    public create(): void
    {
        super.create();

         this.position.set(1080 * 0.5, 1440 * 0.5);

        //  const emo = this._loader.getEmoji("intrigued");
        //  this.addChild(emo);
        
        // Title
        const title = new BasicText("Magic Words", {
            x: 0,
            y: -400,
            style: {
                fontSize: 64,
                fill: 0xffffff,
                stroke: 0x000000,
                strokeThickness: 8
            },
            anchor: { x: 0.5, y: 0.5 }
        });
        
        this.addChild(title);

        // Menu Button
        const menuBtn = new InteractiveText("Menu", {
            x: 0,
            y: -600,
            normalStyle: {
                fontSize: 64,
                fill: 0xFFFFFF
            },
            hoverStyle: {
                fill: 0xFFFF00,
                fontSize: 40
            },
            anchor: { x: 0.5, y: 0.5 }
        });
        
        menuBtn.clickSignal.connect(() => {
            console.log('Menu button clicked!');
            // change scene
            this.sceneChangeSignal.emit("magicwords", "menu");
        });

        this.addChild(menuBtn);
    }

    public enter(): void
    {
        console.log("MG SCENE ENTER --------------------");
        this.alpha = 0;
        gsap.to(this, {
            pixi: { alpha: 1 }, 
            duration: 1
        });
    }

    public exit(instant: boolean): void
    {
        console.log("MG SCENE EXIT --------------------");
        if (instant)
        {
            this.alpha = 0;
        }
        else
        {
            this.alpha = 1;
            gsap.to(this, {
                pixi: { alpha: 0 }, 
                duration: 1
            });
        }
    }
}