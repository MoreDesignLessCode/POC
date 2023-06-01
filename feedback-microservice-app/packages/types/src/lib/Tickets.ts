import { Uuid, IResource } from '@coe/apip-api-types';
import { Nullable } from './Nullable';

export interface ITicket extends IResource {
    id?: Uuid;
    createdBy?: Uuid;
}