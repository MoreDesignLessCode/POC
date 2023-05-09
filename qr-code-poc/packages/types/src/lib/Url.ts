import { Uuid, IResource } from '@procter-gamble/apip-api-types';
import { Nullable } from './Nullable';

export interface IUrl extends IResource {
    id?: Nullable<Uuid>;
    name: string;
    type:string;
    qrcodeId:Uuid;
    refId:Uuid;
}
