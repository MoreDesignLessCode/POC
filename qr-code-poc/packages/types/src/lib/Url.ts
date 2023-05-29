import { Uuid, IResource } from '../../../../dist/packages/api';
import { Nullable } from './Nullable';

export interface IUrl extends IResource {
    id?: Nullable<Uuid>;
    name: string;
    type:string;
    qrcodeId:Uuid;
    refId:Uuid;
}
