import { Uuid, IResource } from '../../../../dist/packages/api';
import { Nullable } from './Nullable';

export interface IParticipant extends IResource {
    id?: Uuid;
    addedBy?: Nullable<Uuid>;
    status: string;
    ticketId?:Uuid;
    profileId?:Uuid;
}