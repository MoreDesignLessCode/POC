import { Uuid, IResource } from '../../../../dist/packages/api';
import { Nullable } from './Nullable';

export interface IQr extends IResource {
    id?: Nullable<Uuid>;
    location: string;
    type?:string
}
