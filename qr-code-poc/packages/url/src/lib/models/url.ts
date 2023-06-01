import { IUrl, Nullable } from '@coe/apip-mktpl-das-qrcode-types';
import { IResource, Uuid } from '@coe/apip-api-types';
import * as Joi from 'joi';

export const UrlSchema = Joi.object({
    id: Joi.string().allow('').allow(null).uuid(),
    name:Joi.string().required(),
    type:Joi.string(),
    qrcodeId:Joi.string().allow('').allow(null).uuid(),
    refId:Joi.string().allow('').allow(null).uuid(),
}).meta({ className: 'Url' });

export class Url implements IUrl {
    id?: Nullable<Uuid>;
    name: string;
    type:string;
    qrcodeId:Uuid;
    refId:Uuid;
    originalUrl?: string;
    newUrl?: string;
    createdBy?:Uuid;
    compressedUrl?:string;
    compactUrl?:string;

    constructor(id: Uuid, name: string,type:string, originalUrl:string, newUrl :string,createdBy:Uuid,compressedUrl:string,compactUrl:string) {
        this.id = id;
        this.name = name;
        this.type=type;
        this.originalUrl= originalUrl;
        this.newUrl=newUrl;
        this.createdBy=createdBy;
        this.compressedUrl=compressedUrl;
        this.compactUrl=compactUrl;
    }
}

