import { IDialogueConfig } from "@core/AssetLoader";
import { Scene } from "@core/Scene";
import { BasicText } from "@px/BasicText";
import { InteractiveText } from "@px/InteractiveText";
import { Sprite } from "@px/Sprite";
import gsap from "gsap";
import { Container, TextStyle } from "pixi.js";

export class MagicWordsScene extends Scene
{
    private _dialogue: IDialogueConfig[] = [];
    private _currentDialogueIndex = 0;
    private _dialogueContainer!: Container;
    private _avatarImage!: Sprite;
    private _textDisplay!: Sprite;
    private _emojiDisplay!: Sprite;

    public create(): void
    {
        super.create();

         this.position.set(1080 * 0.5, 1440 * 0.5);

         this._dialogue = this._loader.getDialogue();
        
        // Title
        const title = new BasicText("Magic Words (Click to advance)", {
            x: 0,
            y: -400,
            style: {
                fontSize: 64,
                fill: 0xffffff,
                stroke: 0x000000,
                strokeThickness: 8
            },
            anchor: { x: 0.5, y: 0.5 }
        });
        
        this.addChild(title);

        // Dialogue container
        this._dialogueContainer = new Container();
        this.addChild(this._dialogueContainer);

        // Menu Button
        const menuBtn = new InteractiveText("Menu", {
            x: 0,
            y: -600,
            normalStyle: {
                fontSize: 64,
                fill: 0xFFFFFF
            },
            hoverStyle: {
                fill: 0xFFFF00,
                fontSize: 40
            },
            anchor: { x: 0.5, y: 0.5 }
        });
        
        menuBtn.clickSignal.connect(() => {
            console.log('Menu button clicked!');
            // change scene
            this.sceneChangeSignal.emit("magicwords", "menu");
        });

        this.addChild(menuBtn);

        this.showCurrentDialogue();
    }

    public enter(): void
    {
        console.log("MG SCENE ENTER --------------------");
        this.alpha = 0;
        gsap.to(this, {
            pixi: { alpha: 1 }, 
            duration: 1
        });
    }

    public exit(instant: boolean): void
    {
        console.log("MG SCENE EXIT --------------------");
        if (instant)
        {
            this.alpha = 0;
        }
        else
        {
            this.alpha = 1;
            gsap.to(this, {
                pixi: { alpha: 0 }, 
                duration: 1
            });
        }
    }

    private showCurrentDialogue(): void
    {
        // Clear
        this._dialogueContainer.removeChildren();

        const current = this._dialogue[this._currentDialogueIndex];
        if (!current)
            return;

        // Create character name text
        const characterPosition = this._loader.getAvatarPosition(current.name);
        
        const characterAvatar = this._loader.getAvatar(current.name);
        characterAvatar.x = characterPosition == "left" ? -250 : 250;
        this._dialogueContainer.addChild(characterAvatar);

        const characterName = new BasicText(current.name + ":", {
            x: characterPosition == "left" ? -250 : 250,
            y: 120,
            style: {
                fontSize: 36,
                fill: 0xffffff,
                fontStyle: "italic"
            },
            anchor: { x: 0.5, y: 0.5 }
        });

        this._dialogueContainer.addChild(characterName);

        this.createTextWithEmoji(current.text);

        // Click to advance
        this.interactive = true;
        this.once("pointerdown", this.nextDialogue.bind(this));
    }

    private createTextWithEmoji(text: string, defaultEmoji = "intrigued"): void
    {
        // {<placeholder>}
        const parts = text.split(/(\{[^}]+\})/);
        let currentX = -220;
        const lineHeight = 100;
        let currentY = 150;
        
        // Container for the text
        const textContainer = new Container();
        textContainer.position.set(currentX, currentY);
        this._dialogueContainer.addChild(textContainer);
    
        const textStyle = new TextStyle({
            fontFamily: "Arial",
            fontSize: 32,
            fill: 0xffffff,
            lineHeight: lineHeight,
            wordWrap: true,
            wordWrapWidth: 700,
            align: "center"
        });
    
        for (const part of parts)
        {
            // The emoji placeholder
            if (part.startsWith('{') && part.endsWith('}'))
            {
                const emojiKey = part.slice(1, -1);
                let emojiSprite = this._loader.getEmoji(emojiKey);
                
                if (!emojiSprite)
                {
                    emojiSprite = this._loader.getEmoji(defaultEmoji);
                }

                if (emojiSprite)
                {
                    emojiSprite.scale.set(0.6);
                    emojiSprite.anchor.set(0);
                    emojiSprite.position.set(currentX, currentY + lineHeight/2 - emojiSprite.height/2);
                    textContainer.addChild(emojiSprite);
                    currentX += emojiSprite.width + 5;
                }
            }
            else if (part.trim().length > 0)
            {
                // This is regular text
                const textElement = new BasicText(part, {
                    x: currentX,
                    y: currentY,
                    style: textStyle,
                    anchor: { x: 0, y: 0 },
                });
                textContainer.addChild(textElement);
                currentX += textElement.width + 5;
            }
        }
    }

    private nextDialogue(): void
    {
        ++this._currentDialogueIndex;
        
        // Loops
        if (this._currentDialogueIndex >= this._dialogue.length)
        {
            this._currentDialogueIndex = 0;
        }
        
        this.showCurrentDialogue();
    }
}