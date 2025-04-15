import { Container, DisplayObject } from "pixi.js";
import { Stage } from "./Stage";
import { Signal } from "typed-signals";
import { AssetLoader } from "./AssetLoader";
import { Game } from "./Game";

export class Scene extends Container<DisplayObject>
{
    public readonly sceneChangeSignal = new Signal<(from: string, to: string) => void>();

    protected _game!: Game;
    protected _stage!: Stage;
    protected _loader!: AssetLoader;

    constructor(game: Game, stage: Stage, loader: AssetLoader)
    {
        super();

        this._game = game;
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