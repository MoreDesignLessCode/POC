import { Uuid, IResource } from '@procter-gamble/apip-api-types';

export interface IAttachment extends IResource {
    id?: Uuid;
    file_name?: string;
    url?: string;
    messageId?:Uuid;
}