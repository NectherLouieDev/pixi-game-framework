import { MenuScene } from "scenes/MenuScene";
import { Scene } from "./Scene";
import { Stage } from "./Stage";
import { AOSScene } from "scenes/AOSScene";
import { MagicWordsScene } from "scenes/MagicWordsScene";
import { PheonixFlameScene } from "scenes/PheonixFlameScene";

export class Game
{
    private _stage!: Stage; 

    private _scenes: Record<string, Scene> = {};
    private _currentScene!: Scene;

    constructor (stage: Stage)
    {
        this._stage = stage;
    }

    public create(): void
    {
        // Create scenes
        this.createScene("menu", new MenuScene(this._stage));
        this.createScene("aos", new AOSScene(this._stage));
        this.createScene("magicwords", new MagicWordsScene(this._stage));
        this.createScene("pheonixflame", new PheonixFlameScene(this._stage));
        
        // Start menu scene
        this.changeScene("menu");
    }

    private createScene(name: string, scene: Scene): void
    {
        this._scenes[name] = scene;

        scene.create();

        this._stage.addScene(scene);
    }

    public getScene(name: string): Scene
    {
        return this._scenes[name];
    }

    public changeScene(name: string): void
    {
        if (this._currentScene)
            this._currentScene.exit();

        this._currentScene = this.getScene(name);

        this._currentScene.enter();
    }
}