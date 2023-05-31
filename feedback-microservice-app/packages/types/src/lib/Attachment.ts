import { Uuid, IResource } from '@litmus7/apip-api-types';

export interface IAttachment extends IResource {
    id?: Uuid;
    file_name?: string;
    url?: string;
    messageId?:Uuid;
}