import { Container, DisplayObject } from "pixi.js";
import { Stage } from "./Stage";

export class Scene extends Container<DisplayObject>
{
    protected _stage!: Stage;

    constructor(stage: Stage)
    {
        super();
        this._stage = stage;
    }

    public create(): void
    {
    }

    public enter(): void
    {
    }

    public exit(): void
    {
    }
}