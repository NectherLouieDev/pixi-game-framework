import { Assets, Container, Graphics } from "pixi.js";
import { AssetLoader, ILoadProgressData } from "./AssetLoader";
import { Stage } from "./Stage";
import { Game } from "./Game";

export class Bootstrapper
{
    private _stage!: Stage;
    private _loader!: AssetLoader;

    public async start(): Promise<void>
    {
        // Create the main stage
        this._stage = new Stage({
            width: 1080,
            height: 1440,
            backgroundColor: 0x1099bb,
        });

        const loader = this._loader = new AssetLoader();

        loader.errorSignal.connect(this.onError.bind(this));
        loader.progressSignal.connect(this.onProgress.bind(this));
        loader.loadCompleteSignal.connect(this.onComplete.bind(this));
        loader.dialogueFetchCompleteSignal.connect(this.onDialogueFtechComplete.bind(this))

        loader.addAssets([
            { alias: "card-red", src: "/assets/card-red.png" },
            { alias: "card-green", src: "/assets/card-green.png" },
            { alias: "card-blue", src: "/assets/card-blue.png" },
            { alias: "particle1", src: "/assets/particle1.png" },
            { alias: "particle2", src: "/assets/particle2.png" },
            { alias: "particle3", src: "/assets/particle3.png" }
        ])

        loader.load();
    }

    private onProgress(data: ILoadProgressData): void
    {
        console.log("Progress:", data.progress);
    }

    private onError(msg: string, error?: any): void
    {
        console.error(msg, error);
    }

    private onComplete(): void
    {
        console.log("All assets loaded successfully");

        this._loader.fetchDialogues();
    }

    private onDialogueFtechComplete(): void
    {
        this.createGame();
    }

    // private setupScene(): void
    // {
    //     const scene = new Container();
    //     const box = new Graphics();

    //     box.beginFill(0xFF0000);
    //     box.lineStyle(2, 0x0000FF);
    //     box.drawRect(0, 0, 100, 50);
    //     box.endFill();
    //     box.position.set(50, 50);

    //     scene.addChild(box);
    //     this._stage.addScene(scene);

    //     // Example of using loaded assets
    //     const redCard = new Sprite(this._loader.getTexture('card-red'));
    //     scene.addChild(redCard);
    // }

    private createGame(): void
    {
        const game = new Game(this._stage, this._loader);
        game.create();
    }
}