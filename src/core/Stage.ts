import { Application, Container, DisplayObject, ICanvas, IRenderer } from 'pixi.js';
import { BasicFPS } from './BasicFPS';

/**
 * @class Stage
 * The root display container
 */
export class Stage
{
    private _app: Application;
    private _renderer: IRenderer<ICanvas>;
    private _view: ICanvas | HTMLCanvasElement;
    private _stageContainer: Container<DisplayObject>;
    private _gameScale: number = 1;

    private _gameContainer: HTMLDivElement;
    private _designWidth: number;
    private _designHeight: number;
    private _portrait: boolean;

    constructor(options: { width: number; height: number; backgroundColor: number })
    {
        // Start in landscape
        this._portrait = false;

        this._designWidth = options.width;
        this._designHeight = options.height;

        this._app = new Application({
            width: this._designWidth,
            height: this._designHeight,
            backgroundColor: options.backgroundColor,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true
        });

        new BasicFPS(this._app);

        this._renderer = this._app.renderer;
        this._view = this._renderer.view;
        this._stageContainer = this._app.stage;

        this._gameContainer = document.getElementById('game-container') as HTMLDivElement;
        this._gameContainer.appendChild(this._view as HTMLCanvasElement);

        this.setupResizeHandler();
        this.resize();

        const view = this._view as HTMLCanvasElement;
        view.requestFullscreen();
    }

    private setupResizeHandler(): void
    {
        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('orientationchange', this.orientationChange.bind(this));
    }

    private orientationChange(): void
    {
        // Note: should i use this?
        // this._portrait = window.matchMedia("(orientation: portrait)").matches;
        this.resize();
    }

    private resize(): void
    {
        
        
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const designRatio = this._designWidth / this._designHeight;
        const windowRatio = windowWidth / windowHeight;
        
        let newWidth: number;
        let newHeight: number;

        this._portrait = windowRatio > designRatio;

        // Scale to height in portrait
        // Scale to width in landscape
        if (this._portrait)
        {
            newHeight = windowHeight;
            newWidth = newHeight * designRatio;
        }
        else
        {
            newWidth = windowWidth;
            newHeight = newWidth / designRatio;
        }

        // Apply calculated dimensions
        this._view.style!.width = `${newWidth}px`;
        this._view.style!.height = `${newHeight}px`;

        this._gameScale = Math.min(newWidth / this._designWidth, newHeight / this._designHeight);
        
        // Update stage scale
        this._stageContainer.scale.set(this._gameScale);
    }

    public addScene(child: Container<DisplayObject>): void
    {
        this._stageContainer.addChild(child);
    }

    public getGameScale(): number
    {
        return this._gameScale;
    }
}