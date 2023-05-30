import { Uuid, IResource } from '../../../../dist/packages/api';

export interface IAttachment extends IResource {
    id?: Uuid;
    file_name?: string;
    url?: string;
    messageId?:Uuid;
}