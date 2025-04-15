import { Bootstrapper as _Bootstrapper } from "./_internals/Bootstrapper";
import { Stage as _Stage} from "./_internals/Stage";


export const Core = {
    Bootstrapper: _Bootstrapper,
    Stage: _Stage
} as const;

export type {
    _Bootstrapper as Bootstrapper, 
    _Stage as Stage
};