import { Uuid, IResource } from '@procter-gamble/apip-api-types';
import { Nullable } from './Nullable';

export interface IQr extends IResource {
    id?: Nullable<Uuid>;
    location: string;
    type?:string
}
