import { MenuScene } from "scenes/MenuScene";
import { Scene } from "./Scene";
import { Stage } from "./Stage";
import { AOSScene } from "scenes/AOSScene";
import { MagicWordsScene } from "scenes/MagicWordsScene";
import { PheonixFlameScene } from "scenes/PheonixFlameScene";
import { AssetLoader } from "./AssetLoader";

export class Game
{
    private _stage!: Stage;
    private _loader!: AssetLoader;

    private _scenes: Record<string, Scene> = {};
    private _currentScene!: Scene;

    constructor (stage: Stage, loader: AssetLoader)
    {
        this._stage = stage;
        this._loader = loader;
    }

    public create(): void
    {
        // Create scenes
        this.createScene("menu", new MenuScene(this._stage, this._loader));
        this.createScene("aos", new AOSScene(this._stage, this._loader));
        this.createScene("magicwords", new MagicWordsScene(this._stage, this._loader));
        this.createScene("pheonixflame", new PheonixFlameScene(this._stage, this._loader));
        
        // Start menu scene
        this.changeScene("menu");
    }

    private createScene(name: string, scene: Scene): void
    {
        this._scenes[name] = scene;

        scene.sceneChangeSignal.connect(this.onSceneChange.bind(this));
        scene.create();

        this._stage.addScene(scene);

        scene.exit(true);
    }

    public getScene(name: string): Scene
    {
        return this._scenes[name];
    }

    private onSceneChange(from: string, to: string): void
    {
        this.changeScene(to);
    }

    public changeScene(name: string): void
    {
        if (this._currentScene)
            this._currentScene.exit(false);

        this._currentScene = this.getScene(name);

        this._currentScene.enter();
    }
}