import { Uuid, IResource } from '@litmus7/apip-api-types';
import { Nullable } from './Nullable';

export interface IRating extends IResource {
    id?: Uuid;
    rating?:number;
    createdBy?: Uuid;
}