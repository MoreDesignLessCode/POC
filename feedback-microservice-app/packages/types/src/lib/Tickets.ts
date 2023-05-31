import { Uuid, IResource } from '@litmus7/apip-api-types';
import { Nullable } from './Nullable';

export interface ITicket extends IResource {
    id?: Uuid;
    createdBy?: Uuid;
}