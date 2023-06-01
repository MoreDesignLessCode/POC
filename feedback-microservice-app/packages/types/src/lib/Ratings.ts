import { Uuid, IResource } from '@coe/apip-api-types';
import { Nullable } from './Nullable';

export interface IRating extends IResource {
    id?: Uuid;
    rating?:number;
    createdBy?: Uuid;
}