import { Uuid, IResource } from '@procter-gamble/apip-api-types';
import { Nullable } from './Nullable';

export interface ITicket extends IResource {
    id?: Uuid;
    createdBy?: Uuid;
}