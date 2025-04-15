import { Sprite as _Sprite } from "./_internals/Sprite";

export const PX = {
    Sprite: _Sprite
} as const;

export type {
    _Sprite as Sprite
};