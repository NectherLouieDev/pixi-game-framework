import { Container, DisplayObject } from "pixi.js";
import { Stage } from "./Stage";
import { Signal } from "typed-signals";
import { AssetLoader } from "./AssetLoader";

export class Scene extends Container<DisplayObject>
{
    public readonly sceneChangeSignal = new Signal<(from: string, to: string) => void>();

    protected _stage!: Stage;
    protected _loader!: AssetLoader;

    constructor(stage: Stage, loader: AssetLoader)
    {
        super();
        this._stage = stage;
        this._loader = loader;
    }

    public create(): void
    {
    }

    public enter(): void
    {
    }

    public exit(instant: boolean): void
    {
    }
}