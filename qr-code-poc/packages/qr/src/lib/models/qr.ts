import { IQr, Nullable } from '@coe/apip-mktpl-das-qrcode-types';
import { IResource, Uuid } from '@coe/apip-api-types';
import * as Joi from 'joi';

export const QrSchema = Joi.object({
    id: Joi.string().allow('').allow(null).uuid(),
    loacation:Joi.string(),
}).meta({ className: 'QrSchema' });

export const schema = Joi.alternatives().try(
    Joi.object({
        location: Joi.string().uri().required()
    }),
    Joi.array().items(
      Joi.object({
        location: Joi.string().uri().required()
      })
    )
  );

export class Qr implements IQr {
    id?: Nullable<Uuid>;
    location!: string;
    type?:string
    createdBy?:Uuid;
    url?:string;

    constructor(id: Uuid, loacation: string, createdBy:Uuid,url:string) {
        this.id = id;
        this.location = loacation;
        this.createdBy = createdBy;
        this.url = url;
    }
}


