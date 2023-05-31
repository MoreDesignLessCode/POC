import { IMessage } from '@procter-gamble/apip-mktpl-das-feedback-types';
import {  Uuid } from '@litmus7/apip-api-types';
import * as Joi from 'joi';


export const MessageSchema = Joi.object({
    id: Joi.string().uuid(),
    summary: Joi.string().allow(null),
    description: Joi.string().required(),
    attachments: Joi.array(),
    status: Joi.string(),
    artifactIdValue:Joi.string().uuid(),
    artifactType: Joi.string(),
    createdBy: Joi.string(),  // TODO  : need to change to UUID
})

export const MessageArraySchema = Joi.alternatives().try(
    Joi.object({
        id: Joi.string().uuid(),
        summary: Joi.string().allow(null),
        description: Joi.string().required(),
        attachments: Joi.array(),
        status: Joi.string(),
        reference:Joi.string(),
        artifactIdValue:Joi.string().uuid(),
        artifactType: Joi.string(),
        createdBy: Joi.string(),  // TODO  : need to change to UUID
    }).meta({ className: 'Message' }),
    Joi.array().items(
        Joi.object({
            id: Joi.string().uuid(),
            summary: Joi.string().allow(null),
            description: Joi.string().required(),
            attachments: Joi.array(),
            status: Joi.string(),
            reference:Joi.string(),
            artifactIdValue:Joi.string().uuid(),
            artifactType: Joi.string(),
            createdBy: Joi.string(),  // TODO  : need to change to UUID
        }).meta({ className: 'Message' }),
    ),
    );

class Attachmentids {
    id: Uuid;
}

export class Messages implements IMessage {
    [x: string]: any;
    id?: Uuid;
    summary!: string;
    description!: string;
    attachments?: Attachmentids[];
    status?: string;
    createdBy?: Uuid;
    artifactIdValue?:Uuid;
    artifactType?:string;
    reference?:string;

    constructor(id: Uuid, summary: string, description: string,status:string, createdBy:Uuid,attachments:Attachmentids[]) {
        this.id = id;
        this.summary = summary;
        this.description=description;
        this.status=status;
        this.createdBy=createdBy;
        this.attachments=attachments
    }

}

