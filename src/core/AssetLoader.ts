import { Assets, Texture } from "pixi.js";
import { Signal } from "typed-signals";

export interface IAssetConfig
{
    alias: string;
    src: string;
}

export interface ILoadProgressData 
{
    progress: string;
    asset: string;
}

export class AssetLoader 
{
    public readonly errorSignal = new Signal<(s: string, e?: any) => void>();
    public readonly progressSignal = new Signal<(a: ILoadProgressData) => void>();
    public readonly loadCompleteSignal = new Signal<(s: string) => void>();

    private _assets: IAssetConfig[] = [];

    public addAssets(assets: IAssetConfig[]): void
    {
        const formattedAssets: IAssetConfig[] = [];

        for (let i = 0; i < assets.length; ++i)
        {
            formattedAssets.push({
                alias: assets[i].alias,
                src: assets[i].src
            });
        }

        this._assets = formattedAssets
    }

    public async load(): Promise<void>
    {
        try {
            await this.loadAssets();
            this.loadCompleteSignal.emit("Load Completed");
        }
        catch
        {
            this.errorSignal.emit("Error Loading");
        }
    }

    private async loadAssets(): Promise<void>
    {
        this.progressSignal.emit({
            progress: "Test",
            asset: "Test"
        });

        await Assets.load(this._assets);
    }

    public getTexture(name: string): Texture 
    {
        return Assets.get(name);
    }
}