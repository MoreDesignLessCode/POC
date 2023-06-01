import { Uuid, IResource } from '@coe/apip-api-types';

export interface IAttachment extends IResource {
    id?: Uuid;
    file_name?: string;
    url?: string;
    messageId?:Uuid;
}