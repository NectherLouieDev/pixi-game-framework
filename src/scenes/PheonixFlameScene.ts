import { Scene } from "@core/Scene";
import { Texture, Container } from "pixi.js";
import gsap from "gsap";
import { BasicText } from "@px/BasicText";
import { InteractiveText } from "@px/InteractiveText";
import { Sprite } from "@px/Sprite";

export class PhoenixFlameScene extends Scene
{
    private _fireParticles: Sprite[] = [];
    private _particleContainer!: Container;
    private _maxParticles = 10;
    private _particleTextures: Texture[] = [];

    public async create(): Promise<void>
    {
        super.create();
        
        this.position.set(1080 * 0.5, 1440 * 0.5);

        // Title
        const title = new BasicText("Pheonix Flames", {
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

        // Textures here
        this._particleTextures = [
            this._loader.getTexture("particle1"),
            this._loader.getTexture("particle2"),
            this._loader.getTexture("particle3")
        ];

        this._particleContainer = new Container();
        this._particleContainer.x = 0;
        this._particleContainer.y = 0;
        this._particleContainer.alpha = 1;
        this.addChild(this._particleContainer);
        
        // this.addChild(new Sprite(this._loader.getTexture("particle1")))
        // Listen for update
        this._game.updateSignal.connect(this.updateParticles.bind(this));

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

    private createParticle(): void
    {
        if (this._fireParticles.length >= this._maxParticles)
            return;

        // Random new particle
        const texture = this._particleTextures[
            Math.floor(Math.random() * this._particleTextures.length)
        ];
        const particle = new Sprite(texture);
        
        // Setup
        particle.anchor.set(0.5);
        particle.scale.set(0.25 + Math.random() * 0.5);
        particle.alpha = 0.5 + Math.random() * 0.3;
        particle.rotation = Math.random() * Math.PI * 2;
        particle.position.set(
            (Math.random() * 200) - 100,  // Random x position (-100 to 100)
            50 // Bottom position
        );
        const tintVariation = Math.random();
        particle.tint = tintVariation > 0.7 ? 0xFF4500 :  // orange-red
                        tintVariation > 0.4 ? 0xFFA500 : // orange
                                            0xFFFF00;  // yellow

        gsap.to(particle, {
            pixi: {
                x: (Math.random() * 80 - 50),
                y: -300 + Math.random() * 100,
                // rotation: particle.rotation + (Math.random() * 1 - 0.5),
                alpha: 0.1 + Math.random() * 0.3,
                scaleX: particle.scale.x * 0.2,
                scaleY: particle.scale.y * 0.2,
            },
            duration: .5 + Math.random(),
            ease: "power1.out",
            onComplete: () => {
                // Remove particle when animation completes
                this._particleContainer.removeChild(particle);

                // Filter particeles
                const filteredParticles = [];
                for (const p of this._fireParticles)
                {
                    if (p !== particle)
                    {
                        filteredParticles.push(p);
                    }
                }

                this._fireParticles = filteredParticles;
            }
        });

        this._particleContainer.addChild(particle);
        
        this._fireParticles.push(particle);
    }

    private updateParticles(dt: number): void
    {
        // Create 1-2 new particles per frame if below max
        if (this._fireParticles.length < this._maxParticles)
        {
            const particlesToAdd = Math.min(
                1 + Math.floor(Math.random() * 2),
                this._maxParticles - this._fireParticles.length
            );
            
            for (let i = 0; i < particlesToAdd; i++)
            {
                this.createParticle();
            }
        }
    }

    public enter(): void
    {
        console.log("PH SCENE ENTER --------------------");
        this.alpha = 0;
        gsap.to(this, {
            pixi: { alpha: 1 }, 
            duration: 1
        });
    }

    public exit(instant: boolean): void
    {
        console.log("PH SCENE EXIT --------------------");
        
        this._fireParticles.forEach(particle => {
            gsap.killTweensOf(particle);
        });

        this._particleContainer.removeChildren();
        this._fireParticles = [];

        if (instant)
        {
            this.alpha = 0;
        }
        else
        {
            gsap.to(this, {
                pixi: { alpha: 0 }, 
                duration: 1
            });
        }
    }
}