import { Sprite as PIXISprite, Texture } from "pixi.js";

export class Sprite extends PIXISprite
{
    constructor(texture: Texture)
    {
        super(texture);
        
        // Test set to 0.5 always
        this.anchor.set(0.5, 0.5);
    }
}