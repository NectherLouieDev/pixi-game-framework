import { Scene } from "@core/Scene";
import { BasicText } from "@px/BasicText";

export class MenuScene extends Scene
{
    public create(): void
    {
        super.create();

        const title = new BasicText('SOFTGAMES TEST', {
            x: 600,
            y: 800,
            style: {
                fontSize: 64,
                fill: 0xffffff,
                stroke: 0x000000,
                strokeThickness: 8
            },
            anchor: { x: 0.5, y: 0.5 }
        });
        
        // Center in a 800x600 container
        this.addChild(title);
    }
}