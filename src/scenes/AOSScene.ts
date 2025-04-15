import { Scene } from "@core/Scene";
import { BasicText } from "@px/BasicText";
import { InteractiveText } from "@px/InteractiveText";
import { Sprite } from "@px/Sprite";
import gsap from "gsap";

export interface IStackPosition
{
    x: number;
    y: number;
}

export class AOSScene extends Scene
{
    private _cards: Sprite[] = [];
    private _cardMaxCount = 144;
    private _stacks: Sprite[][] = [[], [], [], []];
    private _moveInterval!: number;
    private _cardWidth = 200;
    private _cardHeight = 300;
    private _cardOffset = 3;
    private _stackPositions: IStackPosition[] = [];

    public create(): void
    {
        super.create();
        
        this.position.set(1080 * 0.5, 1440 * 0.5);

        // Title
        const title = new BasicText("Ace Of Shadows", {
            x: 0,
            y: 400,
            style: {
                fontSize: 64,
                fill: 0xffffff,
                stroke: 0x000000,
                strokeThickness: 8
            },
            anchor: { x: 0.5, y: 0.5 }
        });
        
        this.addChild(title);

        // Stacks
        this._stackPositions = [
            {x: -this._cardWidth + 100, y: 0},
            {x: -100, y: 0},
            {x: this._cardWidth - 100, y: 0},
            {x: (this._cardWidth * 2) - 100, y: 0},
        ]

        let mainStack = this._stacks[0];

        for (let i = 0; i < this._cardMaxCount; ++i)
        {
            const card = new Sprite(this._loader.getTexture('card-red'));
            
            // Offset Y
            card.x = this._stackPositions[0].x;
            card.y = -i * this._cardOffset;
            card.zIndex = i; // New card on top
            
            this._cards.push(card);
            
            mainStack.push(card); // Add all cards to first stack initially
            
            this.addChild(card);
        }

        // Position initial stack;
        const stackX = -2 * (this._cardWidth) - this._stackPositions[0].x;

        for (let i = 0; i < mainStack.length; ++i)
        {
            const card = mainStack[i];

            gsap.to(card, {
                x: stackX,
                duration: 0
            });
        }

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
            this.sceneChangeSignal.emit("aos", "menu");
        });

        this.addChild(menuBtn);
    }

    private startCardMovement(): void
    {
        this._moveInterval = window.setInterval(() => {
            this.moveTopCard();
        }, 1000); // Move every 1 seconds (1s pause + 2s animation)
    }

    private moveTopCard(): void
    {
        // Randomly select source and destination stacks from the other 3 stacks
        let fromStackIndex: number = 0; // 0 always main
        let toStackIndex: number = Math.floor(Math.random() * (this._stacks.length - 1)) + 1; // exclude 0

        console.log("To Stack Index", toStackIndex);
        
        const fromStack = this._stacks[fromStackIndex];
        const toStack = this._stacks[toStackIndex];
        const card = fromStack.pop()!;

        // Calculate target positions
        const toX = this._stackPositions[toStackIndex].x
        const toY = this._stackPositions[toStackIndex].y - (this._cardOffset * toStack.length);

        // Animate the card
        gsap.to(card, {
            x: toX,
            y: toY,
            duration: 2,
            ease: "power2.inOut",
            onStart: () => {
                // This ensures top draw layer
                this.removeChild(card);
                this.addChild(card);
            },
            onComplete: () => {
                toStack.push(card);
            }
        });
    }

    public enter(): void
    {
        console.log("AOS SCENE ENTER --------------------");
        this.alpha = 0;
        gsap.to(this, {
            pixi: { alpha: 1 }, 
            duration: 1,
            onComplete: this.startCardMovement.bind(this)
        });
    }

    public exit(instant: boolean): void
    {
        console.log("AOS SCENE EXIT ----------------");
        clearInterval(this._moveInterval);

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