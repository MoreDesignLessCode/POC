import { Uuid, IResource } from '../../../../dist/packages/api';
import { Nullable } from './Nullable';

export interface ITicket extends IResource {
    id?: Uuid;
    createdBy?: Uuid;
}