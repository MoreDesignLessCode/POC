import { Uuid, IResource } from '../../../../dist/packages/api';
import { Nullable } from './Nullable';

export interface IRating extends IResource {
    id?: Uuid;
    rating?:number;
    createdBy?: Uuid;
}