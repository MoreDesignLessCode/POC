import { ITicket, Nullable } from '@procter-gamble/apip-mktpl-das-feedback-types';
import { Uuid } from '@procter-gamble/apip-api-types';
import * as Joi from 'joi';

const MessageValidationSchema = Joi.object({
    id: Joi.string().allow('').allow(null).uuid(),
    summary: Joi.string().allow(null).optional(),
    description: Joi.string().required(),
    attachmentIds: Joi.array().items(Joi.string().uuid()).allow(null).optional(),
    status: Joi.string().required(),
    createdBy: Joi.string().allow('').allow(null).uuid(),
});

const ParticipantValidationSchema = Joi.object({
    profileId: Joi.string().uuid().required(),
    status: Joi.string().required(),
    addedBy: Joi.string().optional(),
})



export const TicketSchema = Joi.object({
    id: Joi.string().allow('').allow(null).uuid(),
    participants: Joi.array().items(ParticipantValidationSchema).optional(),
    messages: MessageValidationSchema.required(),
    tags: Joi.array()
}).meta({ className: 'Ticket' });

export const TicketPatchSchema= Joi.array().items(ParticipantValidationSchema).required()

class Participants {
    id?: Uuid;
    addedBy?: Nullable<Uuid>;
    status!: string;
    ticketId?: Uuid;
    profileId?: Uuid;
    createdBy?: Uuid;
}

export class Message {
    id?: Uuid;
    summary!: Nullable<string>;
    description!: string;
    attachments?: Attachments[];
    status?: string;
    createdBy?: string;
    attachmentIds?:Uuid[];

}

class Attachments {
    id?: Uuid;
    file_name!: string;
    url!: string;
    messageId?: Uuid;

}
export class Tickets implements ITicket {
    id?: Uuid;
    status?: string;
    createdBy?: Uuid;
    summary?: string;
    description?: string;
    participants?: Participants[];
    messages?: Message | Message[];
    messageIds?: Uuid[];
    participantIds?: Uuid[];
    attachmentIds?: Uuid[];
    attachments?: Attachments[];


    constructor(id: Uuid, createdBy: Uuid, status: string, summary: string, description: string,
        messageIds: Uuid[], participantsIds: Uuid[], attachmentIds: Uuid[],
        messages: Message, participants: Participants[], attachments: Attachments[]) {
        this.id = id;
        this.createdBy = createdBy;
        this.status = status;
        this.summary = summary;
        this.description = description;
        this.messageIds = messageIds;
        this.participantIds = participantsIds;
        this.attachmentIds = attachmentIds;
        this.messages = messages;
        this.participants = participants;
        this.attachments = attachments


    }

}

