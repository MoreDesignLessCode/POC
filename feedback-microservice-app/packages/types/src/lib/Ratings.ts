import { Uuid, IResource } from '@procter-gamble/apip-api-types';
import { Nullable } from './Nullable';

export interface IRating extends IResource {
    id?: Uuid;
    rating?:number;
    createdBy?: Uuid;
}