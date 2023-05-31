import { Uuid, IResource } from '@litmus7/apip-api-types';
import { Nullable } from './Nullable';

export interface IUrl extends IResource {
    id?: Nullable<Uuid>;
    name: string;
    type:string;
    qrcodeId:Uuid;
    refId:Uuid;
}
