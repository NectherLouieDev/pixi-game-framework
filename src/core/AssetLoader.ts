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
    sprite: Sprite;
}

export interface IAvatarData
{
    name: string;
    url: string;
    position: string;
}

export enum IAvatarPosition
{
    Left = "left",
    Right = "right"
}

export interface IAvatarConfig
{
    name: string;
    sprite: Sprite;
    position: IAvatarPosition 
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

    private _avatars:  Record<string, IAvatarConfig> = {};

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
            const avatars = data.avatars;
            this.fetchAvatars(avatars);
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
            // Sad is index 1
            for (let i = 1; i < emojiData.length; ++i)
            {
                const name = emojiData[i].name;
                const url = emojiData[i].url;
                const response = await fetch(url);
                const blob = await response.blob();
                const base64Url = await this.blobToBase64(blob);

                const texture = await Assets.load(base64Url);
                // const texture = Texture.from(base64Url)
                this._emojis[name] = {
                    name: name,
                    sprite: new Sprite(texture)
                };
            }
        }
        catch(error)
        {
            this.errorSignal.emit("Error fetching emoji");
        }
    }

    private async fetchAvatars(avatarData: IAvatarData[]): Promise<void>
    {
        try
        {
            for (let i = 0; i < avatarData.length; ++i)
            {
                const name = avatarData[i].name;
                const url = avatarData[i].url;
                const response = await fetch(url);
                const blob = await response.blob();
                const base64Url = await this.blobToBase64(blob);

                const texture = await Assets.load(base64Url);

                this._avatars[name] = {
                    name: name,
                    sprite: new Sprite(texture),
                    position: avatarData[i].position as IAvatarPosition
                };
            }
    
            this.dialogueFetchCompleteSignal.emit();
        }
        catch
        {
            this.errorSignal.emit("Avatar fetchin failed");
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

    public getDialogue(): IDialogueConfig[]
    {
        return this._dialogue;
    }

    public getEmoji(name: string): Sprite|null
    {
        if (!this._emojis[name])
            return null;

        return this._emojis[name].sprite;
    }

    public getAvatar(name: string): Sprite
    {
        if (!this._avatars[name])
            return this._avatars["Sheldon"].sprite;
        return this._avatars[name].sprite;
    }

    public getAvatarPosition(name: string): string
    {
        if (!this._avatars[name])
            return this._avatars["Sheldon"].position;

        return this._avatars[name].position;
    }
}