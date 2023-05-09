import { IQr, Nullable } from '@procter-gamble/apip-mktpl-das-person-types';
import { IResource, Uuid } from '@procter-gamble/apip-api-types';
import * as Joi from 'joi';

export const QrSchema = Joi.object({
    id: Joi.string().allow('').allow(null).uuid(),
    loacation:Joi.string(),
}).meta({ className: 'QrSchema' });

export class Qr implements IQr {
    id?: Nullable<Uuid>;
    location!: string;
    type?:string

    constructor(id: Uuid, loacation: string) {
        this.id = id;
        this.location = loacation;
    }
}


