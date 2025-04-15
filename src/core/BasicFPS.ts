import { Application, Graphics, Text, TextStyle } from "pixi.js";

export class BasicFPS
{
    private fpsText: Text;
    private lastTime: number = 0;
    private frameCount: number = 0;
    private fps: number = 0;

    constructor(private app: Application)
    {
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });

        this.fpsText = new Text('FPS: 0', style);
        this.fpsText.position.set(10, 10);
        app.stage.addChild(this.fpsText);

        this.lastTime = performance.now();
        app.ticker.add(this.update.bind(this));
    }

    private update(): void
    {
        this.frameCount++;
        const now = performance.now();
        const delta = now - this.lastTime;

        if (delta >= 1000)
        {
            this.fps = Math.round((this.frameCount * 1000) / delta);
            this.fpsText.text = "FPS: " + this.fps;
            this.frameCount = 0;
            this.lastTime = now;
        }
    }
}