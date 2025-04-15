import { Text, TextStyle, utils } from 'pixi.js';
import { Signal } from 'typed-signals';

export class InteractiveText extends Text
{
    public readonly clickSignal = new Signal();
    private _isHovered: boolean = false;

    constructor(content: string,
        options: {
            x?: number;
            y?: number;
            normalStyle?: Partial<TextStyle>;
            hoverStyle?: Partial<TextStyle>;
            anchor?: { x?: number; y?: number };
        } = {})
    {
        const normalStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
            ...options.normalStyle
        });

        super(content, normalStyle);

        this.interactive = true;
        this.cursor = 'pointer';

        this.x = options.x ?? 0;
        this.y = options.y ?? 0;

        this.anchor.set(options.anchor?.x ?? 0.5, options.anchor?.y ?? 0.5);

        if (options.hoverStyle) {
            const hoverStyle = new TextStyle({
                ...normalStyle,
                ...options.hoverStyle
            });

            this.on('pointerover', () => {
                this._isHovered = true;
                this.style = hoverStyle;
            });

            this.on('pointerout', () => {
                this._isHovered = false;
                this.style = normalStyle;
            });
        }

        // Click handling
        this.on('pointerdown', () => {
            this.clickSignal.emit();
        });
    }

    public get isHovered(): boolean
    {
        return this._isHovered;
    }
}