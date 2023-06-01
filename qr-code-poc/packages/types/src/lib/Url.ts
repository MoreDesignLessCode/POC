import { Uuid, IResource } from '@coe/apip-api-types';
import { Nullable } from './Nullable';

export interface IUrl extends IResource {
    id?: Nullable<Uuid>;
    name: string;
    type:string;
    qrcodeId:Uuid;
    refId:Uuid;
}
