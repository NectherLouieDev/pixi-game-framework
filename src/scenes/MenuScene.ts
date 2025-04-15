import { Scene } from "@core/Scene";
import { BasicText } from "@px/BasicText";
import { InteractiveText } from "@px/InteractiveText";
import gsap from "gsap";

export class MenuScene extends Scene
{
    private _title!: BasicText;
    private _aosBtn!: InteractiveText;
    private _mgcBtn!: InteractiveText;
    private _pfBtn!: InteractiveText;

    public create(): void
    {
        super.create();
        
        this.position.set(1080 * 0.5, 1440 * 0.5);

        // Title
        const title = this._title = new BasicText("SOFTGAMES TEST", {
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

        // AOS Button
        const aosBtn = this._aosBtn = new InteractiveText("Ace Of Shadows", {
            x: 0,
            y: -200,
            normalStyle: {
                fontSize: 36,
                fill: 0xFFFFFF
            },
            hoverStyle: {
                fill: 0xFFFF00,
                fontSize: 40
            },
            anchor: { x: 0.5, y: 0.5 }
        });
        
        aosBtn.clickSignal.connect(() => {
            console.log('AOS button clicked!');
            // change scene
            this.sceneChangeSignal.emit("menu", "aos");
        });
        
        this.addChild(aosBtn);

        // Magic words button
        const magicBtn = this._mgcBtn = new InteractiveText("Magic Words", {
            x: 0,
            y: 0,
            normalStyle: {
                fontSize: 36,
                fill: 0xFFFFFF
            },
            hoverStyle: {
                fill: 0xFFFF00,
                fontSize: 40
            },
            anchor: { x: 0.5, y: 0.5 }
        });
        
        magicBtn.clickSignal.connect(() => {
            console.log('Magic Words button clicked!');
            // change scene
            this.sceneChangeSignal.emit("menu", "magicwords");
        });
        
        this.addChild(magicBtn);

        // Pheonix Flame button
        const pfBtn = this._pfBtn = new InteractiveText("Pheonix Flame", {
            x: 0,
            y: 200,
            normalStyle: {
                fontSize: 36,
                fill: 0xFFFFFF
            },
            hoverStyle: {
                fill: 0xFFFF00,
                fontSize: 40
            },
            anchor: { x: 0.5, y: 0.5 }
        });
        
        pfBtn.clickSignal.connect(() => {
            console.log('Pheonix Flame button clicked!');
            // change scene
            this.sceneChangeSignal.emit("menu", "pheonixflame");
        });
        
        this.addChild(pfBtn);

        this._stage.resizeSignal.connect(this.onResize.bind(this));
    }

    private onResize(width: number, height: number, scale: number, portrait: boolean): void
    {
        this.position.set(1080 * 0.5, 1440 * 0.5);
    }

    public enter(): void
    {
        this.alpha = 0;
        gsap.to(this, {
            pixi: { alpha: 1 }, 
            duration: 1
        });
    }

    public exit(instant: boolean): void
    {
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