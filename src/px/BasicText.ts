import { Text, TextStyle, TextStyleAlign } from 'pixi.js';

export class BasicText extends Text
{
    constructor(content: string, options: {
            x?: number;
            y?: number;
            style?: Partial<TextStyle>;
            anchor?: { x?: number; y?: number };
            align?: TextStyleAlign;
        } = {})
    {
        const defaultStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
            align: 'left',
            ...options.style
        });

        super(content, defaultStyle);

        this.x = options.x ?? 0;
        this.y = options.y ?? 0;

        // Anchor (center by default)
        this.anchor.set(options.anchor?.x ?? 0.5, options.anchor?.y ?? 0.5);

        if (options.align)
        {
            this.style.align = options.align;
        }
    }

    public centerInContainer(width: number, height: number): void {
        this.position.set(width / 2, height / 2);
    }
}