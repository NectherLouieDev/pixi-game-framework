import { Scene } from "@core/Scene";
import { Texture } from "pixi.js";
import gsap from "gsap";
import { BasicText } from "@px/BasicText";
import { InteractiveText } from "@px/InteractiveText";
import { LazyParticleEmitter } from "@px/LazyParticleEmitter";

export class PhoenixFlameScene extends Scene
{
    private _particleEmitter!: LazyParticleEmitter;

    public async create(): Promise<void>
    {
        super.create();
        this.position.set(1080 * 0.5, 1440 * 0.5);

        // Title
        const title = new BasicText("Phoenix Flames", {
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

        // Create particle emitter
        const particleTextures = [
            this._loader.getTexture("particle1"),
            this._loader.getTexture("particle2"),
            this._loader.getTexture("particle3")
        ];

        this._particleEmitter = new LazyParticleEmitter({
            textures: particleTextures,
            maxParticles: 10,
            spawnArea: { width: 200, height: 100 },
            targetArea: { width: 80, height: 100, yOffset: -300 },
            tintOptions: [0xFF4500, 0xFFA500, 0xFFFF00]
        });

        this.addChild(this._particleEmitter);
        this._particleEmitter.start();

        // Listen for update
        this._game.updateSignal.connect(this.update.bind(this));

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
            this.sceneChangeSignal.emit("aos", "menu");
        });

        this.addChild(menuBtn);
    }

    private update(dt: number): void
    {
        this._particleEmitter.update(dt);
    }

    public enter(): void
    {
        this.alpha = 0;
        this._particleEmitter.start();
        gsap.to(this, {
            pixi: { alpha: 1 }, 
            duration: 1
        });
    }

    public exit(instant: boolean): void
    {
        this._particleEmitter.stop();
        this._particleEmitter.clear();

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