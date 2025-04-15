import { Scene } from "@core/Scene";
import gsap from "gsap";

export class PheonixFlameScene extends Scene
{
    public create(): void
    {
        super.create();
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