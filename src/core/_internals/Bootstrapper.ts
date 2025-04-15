import { Stage } from "./Stage";

export class Bootstrapper
{
    private _stage!: Stage

    public start(): void
    {
        this._stage = new Stage({
            width: 1080,
            height: 1440,
            backgroundColor: 0x1099bb,
        });

        
    }
}