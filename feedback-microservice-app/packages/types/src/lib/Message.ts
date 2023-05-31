import { Uuid, IResource } from '@litmus7/apip-api-types';
import { Nullable } from './Nullable';

export interface IMessage extends IResource {
    id?: Uuid;
    summary: Nullable<string>;
    description: string;
    status?: string;
    createdBy?: Uuid;
    artifactIdValue?:Uuid;
    artifactType?:string;
    attachmentIds?:Uuid[];
}