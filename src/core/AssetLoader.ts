import { Sprite } from "@px/Sprite";
import { Assets, Texture } from "pixi.js";
import { Signal } from "typed-signals";

export interface IAssetConfig
{
    alias: string;
    src: string;
}

export interface IDialogueConfig
{
    name: string;
    text: string;
}

export interface IEmojiData
{
    name: string;
    url: string;
}

export interface IEmojiConfig
{
    name: string;
    texture: Sprite;
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
    public readonly dialogueFetchCompleteSignal = new Signal();

    private _assets: IAssetConfig[] = [];

    private _dialogue: IDialogueConfig[] = [];

    private _emojiData: IEmojiData[] = [];
    private _emojis:  Record<string, IEmojiConfig> = {};

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

    public async fetchDialogues(): Promise<void>
    {
        try {
            const response = await fetch("https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords");
            const data = await response.json();
            console.log(JSON.stringify(data));

            // Get dialogue
            const dialogue = data.dialogue;
            for (let i = 0; i < dialogue.length; ++i)
            {
                this._dialogue.push({
                    name: dialogue[i].name,
                    text: dialogue[i].text
                });
            }

            // Fetch emojis
            const emojis = data.emojies;
            this.fetchEmojis(emojis);

            // Fetch Avatars
        } 
        catch (error)
        {
            this.errorSignal.emit("Failed to fetch dialogues");
        }
    }

    private async fetchEmojis(emojiData: IEmojiData[]): Promise<void>
    {
        try
        {
            // Sad is having an error being fetched
            for (let i = 1; i < emojiData.length; ++i)
            {
                const name = emojiData[i].name;
                const url = emojiData[i].url;
                const response = await fetch(url);
                const blob = await response.blob();
                const base64Url = await this.blobToBase64(blob);

                // const texture = await Assets.load(base64Url);
                const texture = Texture.from(base64Url)
                this._emojis[name] = {
                    name: name,
                    texture: new Sprite(texture)
                };

                this.dialogueFetchCompleteSignal.emit();
            }
        }
        catch(error)
        {
            this.errorSignal.emit("Error fetching emoji");
        }
    }

    private blobToBase64(blob: Blob): Promise<string>
    {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    public getEmoji(name: string): Sprite
    {
        return this._emojis[name].texture;
    }
}