import { Container, Texture } from "pixi.js";
import gsap from "gsap";
import { Sprite } from "@px/Sprite";

export interface IParticleEmitterOptions
{
    textures: Texture[];
    maxParticles?: number;
    x?: number;
    y?: number;
    spawnArea?: { width: number; height: number };
    targetArea?: { width: number; height: number; yOffset: number };
    baseScale?: number;
    baseAlpha?: number;
    tintOptions?: number[];
    animationDuration?: { min: number; max: number };
};

export class LazyParticleEmitter extends Container
{
    private _particles: Sprite[] = [];
    private _textures: Texture[];
    private _maxParticles: number;
    private _spawnArea: { width: number; height: number };
    private _targetArea: { width: number; height: number; yOffset: number };
    private _baseScale: number;
    private _baseAlpha: number;
    private _tintOptions: number[];
    private _animationDuration: { min: number; max: number };
    private _isActive: boolean = false;

    constructor(options: IParticleEmitterOptions)
    {
        super();
        this._textures = options.textures;
        this._maxParticles = options.maxParticles || 10;
        this._spawnArea = options.spawnArea || { width: 200, height: 100 };
        this._targetArea = options.targetArea || { width: 80, height: 100, yOffset: -300 };
        this._baseScale = options.baseScale || 0.5;
        this._baseAlpha = options.baseAlpha || 0.7;
        this._tintOptions = options.tintOptions || [0xFF4500, 0xFFA500, 0xFFFF00];
        this._animationDuration = options.animationDuration || { min: 0.5, max: 1.5 };

        if (options.x !== undefined)
            this.x = options.x;

        if (options.y !== undefined)
            this.y = options.y;
    }

    public start(): void
    {
        this._isActive = true;
    }

    public stop(): void
    {
        this._isActive = false;
    }

    public update(dt: number): void
    {
        if (!this._isActive) 
            return;

        // Create new particles if below max
        if (this._particles.length < this._maxParticles)
        {
            const particlesToAdd = Math.min(
                1 + Math.floor(Math.random() * 2),
                this._maxParticles - this._particles.length
            );
            
            for (let i = 0; i < particlesToAdd; i++)
            {
                this._createParticle();
            }
        }
    }

    public clear(): void
    {
        this._particles.forEach(particle => {
            gsap.killTweensOf(particle);
        });
        this.removeChildren();
        this._particles = [];
    }

    private _createParticle(): void
    {
        const texture = this._textures[
            Math.floor(Math.random() * this._textures.length)
        ];
        const particle = new Sprite(texture);
        
        // Initial setup
        particle.anchor.set(0.5);
        const initialScale = this._baseScale * (0.5 + Math.random() * 0.5);
        particle.scale.set(initialScale);
        particle.alpha = this._baseAlpha * (0.7 + Math.random() * 0.3);
        particle.rotation = Math.random() * Math.PI * 2;
        particle.position.set(
            (Math.random() * this._spawnArea.width) - (this._spawnArea.width / 2),
            (Math.random() * this._spawnArea.height)
        );

        // Random tint
        particle.tint = this._tintOptions[
            Math.floor(Math.random() * this._tintOptions.length)
        ];

        // Animation
        const duration = this._animationDuration.min + 
                         Math.random() * (this._animationDuration.max - this._animationDuration.min);

        gsap.to(particle, {
            pixi: {
                x: (Math.random() * this._targetArea.width) - (this._targetArea.width / 2),
                y: this._targetArea.yOffset + (Math.random() * this._targetArea.height),
                alpha: 0.1 + Math.random() * 0.3,
                scaleX: initialScale * 0.2,
                scaleY: initialScale * 0.2,
            },
            duration: duration,
            ease: "power1.out",
            onComplete: () => {
                this._removeParticle(particle);
            }
        });

        this.addChild(particle);
        this._particles.push(particle);
    }

    private _removeParticle(particle: Sprite): void
    {
        this.removeChild(particle);
        this._particles = this._particles.filter(p => p !== particle);
    }

    // Getters and setters
    public get isActive(): boolean
    {
        return this._isActive;
    }

    public set maxParticles(value: number)
    {
        this._maxParticles = value;
    }

    public get maxParticles(): number
    {
        return this._maxParticles;
    }
}