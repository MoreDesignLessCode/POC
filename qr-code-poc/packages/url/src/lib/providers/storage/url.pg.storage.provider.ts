/* eslint-disable @typescript-eslint/no-var-requires */
import {
    Uuid,
    Result,
    IStorageProvider,
    IContext,
} from '@procter-gamble/apip-api-types';
import { GeneralAPIError, ResourceNotFoundError } from '../../errors';
import { Url, Constants } from '../../models';
import { formatString } from '../../utils';
import * as Pg from 'pg';
import { validate } from 'uuid';
import { nanoid } from 'nanoid';
import * as zlib from 'zlib';
import * as LZString from 'lz-string'
const GS1DigitalLinkToolkit = require('../../utils/GS1DigitalLinkToolkit')

export class UrlPgStorageProvider implements IStorageProvider<Url> {
    client: Pg.Client;
    columns =
        'id, given_name, middle_name, family_name, created_at, modified_at, deleted_at, created_by, modified_by, deleted_by';

    constructor() {
        const connString = `postgresql://${process.env.PERSON_DAS_DB_USER}:${process.env.PERSON_DAS_DB_PASSWORD}@${process.env.PERSON_DAS_DB_HOST}:${process.env.PERSON_DAS_DB_PORT}/${process.env.PERSON_DAS_DB_NAME}`;

        this.client = new Pg.Client({
            connectionString: connString,
        });
        this.client.connect();

    }

    all = async (_context: IContext): Promise<Result<Url>> => {
        const id: [unknown] = _context.get('ids')
        const temp = [];
        let query =
            ` SELECT u1.urlname AS "fullUrl", u2.urlname AS "compactUrl", u3.urlname as "compressedUrl",u1.id,u1.created_by
                        FROM qrmktpl.url AS u1
                     LEFT JOIN qrmktpl.url u2 ON u1.id = u2.refid AND u2.type = 'SHORT'
            LEFT JOIN qrmktpl.url u3 ON u1.id = u3.refid AND u3.type = 'COMPRESSED'
            WHERE  u1.type = 'FULL'  and u1.deleted_at is NULL`
        if (id?.length > 0) {
            temp.push(id)
            query += ` and u2.id::uuid = ANY($1::uuid[]) `
        }
        try {
            const res = await this.client.query(query, temp
            );

            if (res.rowCount >= 1) {
                return this.handleResult(res, 'collection');
            } else {
                return {
                    type: 'ok',
                    data: { type: 'collection', value: [] },
                };
            }
        } catch (err) {
            const error = new GeneralAPIError(
                Constants.errors.repo.contact.all.CODE,
                err
            )
                .withTitle(Constants.errors.repo.contact.all.TITLE)
                .withReason(Constants.errors.repo.contact.all.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    };


    create = async (entity: Url, context: IContext): Promise<Result<Url>> => {

        const urll = entity?.name
        const now = new Date().toISOString();
        let urlId: Uuid;
        const result = await this.client.query(`SELECT * from qrmktpl.url u where  u.urlname=$1`, [entity.name]);
        if (!(result.rows.length > 0)) {
            urlId = Uuid();
            try {

                await this.client.query(
                    'INSERT INTO qrmktpl.url(id,urlname,type,created_at,created_by) VALUES ($1,$2,$3,$4,$5);',
                    [
                        urlId,
                        urll,
                        "FULL",
                        now,
                        Uuid(),
                    ]
                );
            } catch (err) {
                const error = new GeneralAPIError(
                    Constants.errors.repo.url.create.CODE,
                    err
                )
                    .withTitle(Constants.errors.repo.url.create.TITLE)
                    .withReason(Constants.errors.repo.url.create.MESSAGE);
                return {
                    type: 'error',
                    data: error,
                };
            }
        }
        else {
            urlId = result.rows[0].id;
        }

        const method = context.get('method')
        if (method == 'compress') {
            const res = await this.client.query(`SELECT * from qrmktpl.url u where  u.refid=$1 and u.type='COMPRESSED'`, [urlId]);
            if (res.rows.length == 0) {
                const gs1dlt = new GS1DigitalLinkToolkit();
                const gs1Check = gs1dlt.analyseURI(entity?.name, true)
                if (gs1Check?.detected !== '') {
                    const test = entity?.name
                    const [protocol, , domain, ...path] = test.split('/');
                    const urlDomain = protocol + "//" + domain
                    const compressed = gs1dlt.compressGS1DigitalLink(entity?.name, true, urlDomain, null, true)
                    const now = new Date().toISOString();
                    const newUrlId = Uuid();
                    await this.client.query(
                        'INSERT INTO qrmktpl.url(id,urlname,type,refid,created_at,created_by) VALUES ($1,$2,$3,$4,$5,$6);',
                        [
                            newUrlId,
                            compressed,
                            "COMPRESSED",
                            urlId,
                            now,
                            Uuid(),
                        ]
                    );
                    const response= await this.client.query(
                        `SELECT u1.urlname AS "fullUrl", u2.urlname AS "compactUrl",
                         u3.urlname as "compressedUrl",u1.id,u1.created_by 
                         FROM qrmktpl.url AS u1 LEFT JOIN qrmktpl.url u2 ON u1.id = u2.refid 
                         AND u2.type = 'SHORT' LEFT JOIN qrmktpl.url u3 ON u1.id = u3.refid
                          AND u3.type = 'COMPRESSED' WHERE  u1.type = 'FULL'  and u1 .id = $1`,
                          [urlId]
                    )

                    return {
                        type: 'ok',
                        data: { type: 'resource', value: response.rows[0] },
                    };
                } 
                else{
                    const newUrlId = Uuid();
                    const deflated = zlib.deflateSync(entity?.name).toString('base64');
                    await this.client.query(
                        'INSERT INTO qrmktpl.url(id,urlname,type,refid,created_at,created_by) VALUES ($1,$2,$3,$4,$5,$6);',
                        [
                            newUrlId,
                            deflated,
                            "COMPRESSED",
                            urlId,
                            now,
                            Uuid(),
                        ]
                    );
                    const response= await this.client.query(
                        `SELECT u1.urlname AS "fullUrl", u2.urlname AS "compactUrl",
                         u3.urlname as "compressedUrl",u1.id,u1.created_by 
                         FROM qrmktpl.url AS u1 LEFT JOIN qrmktpl.url u2 ON u1.id = u2.refid 
                         AND u2.type = 'SHORT' LEFT JOIN qrmktpl.url u3 ON u1.id = u3.refid
                          AND u3.type = 'COMPRESSED' WHERE  u1.type = 'FULL'  and u1 .id = $1`,
                          [urlId]
                    )

                    return {
                        type: 'ok',
                        data: { type: 'resource', value: response.rows[0] },
                    };
                }
                
                // else {
                //     const error = new GeneralAPIError(
                //         Constants.errors.repo.url.create.CODE,
                //         "Given url is not a GS1 standard url"
                //     )
                //         .withTitle(Constants.errors.repo.url.create.TITLE)
                //         .withReason(Constants.errors.repo.url.create.MESSAGE);
                //     return {
                //         type: 'error',
                //         data: error,
                //     };
                // }
            }
            else {
                try {
                    const response = await this.findById(urlId, null)
                    return response
                }
                catch (err) {
                    const error = new GeneralAPIError(
                        Constants.errors.repo.url.create.CODE,
                        "short url alrady exists"
                    )
                        .withTitle(Constants.errors.repo.url.create.TITLE)
                        .withReason(Constants.errors.repo.url.create.MESSAGE);
                    return {
                        type: 'error',
                        data: error,
                    };
                }
            }
        }
        else {
            const res = await this.client.query(`SELECT * from qrmktpl.url u where  u.refid=$1 and u.type='SHORT'`, [urlId]);
            if (res.rows.length == 0) {
                await this.createShortUrl(urlId)
                const response= await this.client.query(
                    `SELECT u1.urlname AS "fullUrl", u2.urlname AS "compactUrl",
                     u3.urlname as "compressedUrl",u1.id,u1.created_by 
                     FROM qrmktpl.url AS u1 LEFT JOIN qrmktpl.url u2 ON u1.id = u2.refid 
                     AND u2.type = 'SHORT' LEFT JOIN qrmktpl.url u3 ON u1.id = u3.refid
                      AND u3.type = 'COMPRESSED' WHERE  u1.type = 'FULL'  and u1 .id = $1`,
                      [urlId]
                )
                return {
                    type: 'ok',
                    data: { type: 'resource', value: response.rows[0] },
                };
            }
            else {
                try {
                    const response = await this.findById(urlId, null)
                    return response
                }
                catch (err) {
                    const error = new GeneralAPIError(
                        Constants.errors.repo.url.create.CODE,
                        "short url alrady exists"
                    )
                        .withTitle(Constants.errors.repo.url.create.TITLE)
                        .withReason(Constants.errors.repo.url.create.MESSAGE);
                    return {
                        type: 'error',
                        data: error,
                    };
                }
            }
        }


    }


    async createShortUrl(refId: any) {
        try {
            const now = new Date().toISOString();
            const urlId = Uuid();
            await this.client.query(
                'INSERT INTO qrmktpl.url(id,urlname,type,refid,created_at,created_by) VALUES ($1,$2,$3,$4,$5,$6);',
                [
                    urlId,
                    nanoid(10),
                    "SHORT",
                    refId,
                    now,
                    Uuid(),
                ]
            );
        } catch (err) {
            const error = new GeneralAPIError(
                Constants.errors.repo.url.create.CODE,
                err
            )
                .withTitle(Constants.errors.repo.url.create.TITLE)
                .withReason(Constants.errors.repo.url.create.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    }


    delete = async (id: Uuid, context: IContext): Promise<Result<Url>> => {
        try {
            const now = new Date().toISOString();
            const result1 = await this.client.query(
                'UPDATE qrmktpl.url SET deleted_at=$1, deleted_by=$2 WHERE id=$3 OR refid=$3 AND deleted_at IS NULL;',
                [now, Uuid(), id]
            );
            if (result1.rowCount >= 1) {
                try {
                    const result = await this.client.query(
                        `SELECT * FROM qrmktpl.url WHERE id=$1`,
                        [id]
                    );

                    if (result.rowCount >= 1) {
                        return this.handleResult(result, 'resource');
                    } else {
                        return this.handleResourceNotFound(id);
                    }
                } catch (err) {
                    const error = new GeneralAPIError(
                        Constants.errors.repo.url.innerDelete.CODE,
                        err
                    )
                        .withTitle(
                            Constants.errors.repo.url.innerDelete.TITLE
                        )
                        .withReason(
                            Constants.errors.repo.url.innerDelete.MESSAGE
                        );
                    return {
                        type: 'error',
                        data: error,
                    };
                }
            } else {
                return this.handleResourceNotFound(id);
            }
        } catch (err) {
            const error = new GeneralAPIError(
                Constants.errors.repo.url.delete.CODE,
                err
            )
                .withTitle(Constants.errors.repo.url.delete.TITLE)
                .withReason(Constants.errors.repo.url.delete.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    };

    findById = async (
        id: Uuid,
        _context: IContext
    ): Promise<Result<Url>> => {
        try {

            const res = await this.client.query(
                `SELECT * from qrmktpl.url u  where u.id =$1`,
                [id]
            )
            if (res.rows[0].refid == null) {
                const response = await this.client.query(
                    `SELECT u1.urlname AS "fullUrl", u2.urlname AS "compactUrl", u3.urlname as "compressedUrl",u1.id,u1.created_by
                     FROM qrmktpl.url AS u1
                     LEFT JOIN qrmktpl.url u2 ON u1.id = u2.refid AND u2.type = 'SHORT'
                     LEFT JOIN qrmktpl.url u3 ON u1.id = u3.refid AND u3.type = 'COMPRESSED'
                     WHERE  u1.type = 'FULL'  and u1 .id = $1`,
                    [id]
                )
                if (response.rowCount >= 1) {
                    return this.handleResult(response, 'resource');
                } else {
                    return this.handleResourceNotFound(id);
                }
            }
            else {
                const response = await this.client.query(

                    `select  u1.urlname as "urlname" , u2.urlname as "fullUrl",u2.id,u2.created_by 
                     from qrmktpl.url as u2
                     join qrmktpl.url u1 on u2.id=u1.refid 
                     where  u1.id = $1`, [id]
                )
                if (response.rowCount >= 1) {
                    return this.handleResult(response, 'resource');
                } else {
                    return this.handleResourceNotFound(id);
                }
            }

        } catch (err) {
            const error = new GeneralAPIError(
                Constants.errors.repo.url.find.CODE,
                err
            )
                .withTitle(Constants.errors.repo.url.find.TITLE)
                .withReason(Constants.errors.repo.url.find.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    };

    async save(id: Uuid, entity: Url, context: IContext): Promise<Result<Url>> {

        try{
            const result = await this.client.query(
                'SELECT * from qrmktpl.url u where u.id=$1',
                [id]   
            )
            if(result.rowCount>=1){
                if (result.rows[0].refid == null) {
                    await this.client.query (
                        'UPDATE qrmktpl.url SET urlname=$1  WHERE id=$2;',
                        [
                            entity?.name,
                            id
                        ]
                )
                  const childUrls = await this.client.query(
                  'select u.id,u."type"  from qrmktpl.url u where  u.refid =$1',[id]
                  )

                  if(childUrls.rowCount>0){
                    childUrls.rows.map(async (item)=>{
                        if (item?.type=='SHORT'){
                            const res1= await this.client.query(
                            'UPDATE qrmktpl.url SET urlname=$1  WHERE id=$2;',
                            [
                                nanoid(10),
                                item?.id
                            ]
                             )
                           
                        }
                        else if (item?.type=='COMPRESSED') {
                            const gs1dlt = new GS1DigitalLinkToolkit();
                            const gs1Check = gs1dlt.analyseURI(entity?.name, true)
                            if (gs1Check?.detected !== '') {
                                const test = entity?.name
                                const [protocol, , domain, ...path] = test.split('/');
                                const urlDomain = protocol + "//" + domain
                                const compressed = gs1dlt.compressGS1DigitalLink(entity?.name, true, urlDomain, null, true)
                                                   
                                await this.client.query (
                                    'UPDATE qrmktpl.url SET urlname=$1  WHERE id=$2;',
                                    [
                                        compressed,
                                        item?.id
                                    ]
                            )
                          }
                          else{
                            const now = new Date().toISOString();
                            const result1 = await this.client.query(
                                'UPDATE qrmktpl.url SET deleted_at=$1, deleted_by=$2 WHERE id=$3 OR refid=$3 AND deleted_at IS NULL;',
                                [now, Uuid(), id]
                            );
                          }
                        }
                    })
                    return {
                        type: 'ok',
                        data: { type: 'resource', value: entity},
                    };
                  }
                 
                }
                else{
                    if(result.rows[0].type=='SHORT'){
                        await this.client.query(
                            'UPDATE qrmktpl.url SET urlname=$1  WHERE id=$2;',
                            [
                                nanoid(10),
                                id
                            ]
                             ) 
                    }
                    else if(result.rows[0].type=='COMPRESSED'){
                        const gs1dlt = new GS1DigitalLinkToolkit();
                        const gs1Check = gs1dlt.analyseURI(entity?.name, true)
                        if (gs1Check?.detected !== '') {
                            const test = entity?.name
                            const [protocol, , domain, ...path] = test.split('/');
                            const urlDomain = protocol + "//" + domain
                            const compressed = gs1dlt.compressGS1DigitalLink(entity?.name, true, urlDomain, null, true)
                                               
                            await this.client.query (
                                'UPDATE qrmktpl.url SET urlname=$1  WHERE id=$2;',
                                [
                                    compressed,
                                    id
                                ]
                        )
                      }
                    }
                }
            }
        }
        catch(err){
            const error = new GeneralAPIError(
                Constants.errors.repo.url.save.CODE,
                err
            )
                .withTitle(Constants.errors.repo.url.save.TITLE)
                .withReason(Constants.errors.repo.url.save.MESSAGE);
            return {
                type : 'error',
                data: error
            };

        }
    }


    handleResourceNotFound = (id: Uuid): Result<Url> => {
        const error = new ResourceNotFoundError(
            Constants.errors.notFound.url.CODE
        )
            .withTitle(Constants.errors.notFound.url.TITLE)
            .withReason(
                formatString(Constants.errors.notFound.url.MESSAGE, id)
            );

        return {
            type: 'error',
            data: error,
        };
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    buildUrl = (element: any): Url => {
        const url: Url = new Url(
            element?.id,
            element?.urlname,
            element?.type,
            element?.fullUrl,
            element?.newUrl,
            element?.created_by,
            element?.compressedUrl,
            element?.compactUrl
        );

        return url;
    };
    handleResult = (res: Pg.QueryResult, type: string): Result<Url> => {
        const val: Url[] = [];
        res.rows.forEach((element) => {
            const url: Url = this.buildUrl(element);
            val.push(url);
        });

        if (type === 'resource') {
            return {
                type: 'ok',
                data: { type: 'resource', value: val[0] },
            };
        } else {
            return {
                type: 'ok',
                data: { type: 'collection', value: val },
            };
        }
    };


}
