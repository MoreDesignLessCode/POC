import { GeneralAPIError, ResourceNotFoundError } from '../../errors';
import { Qr, Constants } from '../../models';
import { formatString } from '../../utils';
import * as Pg from 'pg';
import { validate } from 'uuid';
import * as QRCode from 'qrcode';
import { Uuid,IStorageProvider, IContext,Result } from '@coe/apip-api-types';

export class QrPgStorageProvider implements IStorageProvider<Qr> {
    client: Pg.Client;
    columns =
        'id, location,created_at, modified_at, deleted_at, created_by, modified_by, deleted_by';

    constructor() {
        const connString = `postgresql://${process.env.QRCODE_DAS_DB_USER}:${process.env.QRCODE_DAS_DB_PASSWORD}@${process.env.QRCODE_DAS_DB_HOST}:${process.env.QRCODE_DAS_DB_PORT}/${process.env.QRCODE_DAS_DB_NAME}`;

        this.client = new Pg.Client({
            connectionString: connString,
        });
        this.client.connect();
    }
    // all(context: IContext): Promise<Result<Qr>> {
    //     throw new Error('Method not implemented.');
    // }
    async convertUrl(url: string, obj): Promise<string> {
        const qrcode = await QRCode.toDataURL(url,
            {
                errorCorrectionLevel: obj?.errorCorrectionLevel,
                margin: obj?.quiteZone,
                version: obj?.version,
                maskPattern: obj?.mask,


            })
        return qrcode
    }
    async create(entity: Qr, context: IContext): Promise<Result<Qr>> {
        const errorCorrectionLevel = context.get('errorCorrectionLevel')
        const mask = context.get('mask')
        const quiteZone = context.get('quiteZone')
        const size = context.get('size')
        const encodingMode = context.get('encodingMode')
        const obj: any = {}
        obj.errorCorrectionLevel = errorCorrectionLevel
        obj.mask = mask
        obj.size = size
        obj.quiteZone = quiteZone
        obj.encodingMode = encodingMode
        const urll = await this.convertUrl(entity?.location, obj)
        try {
            const urlresult = await this.client.query(
                `SELECT id FROM qrmktpl.url WHERE urlname=$1`,
                [entity?.location]
            );

            const now = new Date().toISOString();
            let qrId = Uuid()
            let urlId = Uuid()
            if (urlresult?.rowCount <= 0) {

                await this.client.query(
                    'INSERT INTO qrmktpl.url(id,urlname,type,qrcodeid,refid,created_at,modified_at,deleted_at,created_by,modified_by,deleted_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);',
                    [
                        urlId,
                        entity?.location,
                        "FULL",
                        null,
                        null,
                        //base64Image,
                        now,
                        null,
                        null,
                        Uuid(),
                        null,
                        null,
                    ]
                );

            }
            await this.client.query(
                'INSERT INTO qrmktpl.qrcodes(id,location,created_at,modified_at,deleted_at,created_by,modified_by,deleted_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8);',
                [
                    qrId,
                    urll,
                    //base64Image,
                    now,
                    null,
                    null,
                    Uuid(),
                    null,
                    null,
                ]
            );
            if (urlresult?.rowCount <= 0) {
                await this.client.query(
                    'UPDATE qrmktpl.url SET qrcodeid=$1  WHERE id=$2;',
                    [
                        qrId,
                        urlId,
                    ])
            }
            else {
                await this.client.query(
                    'UPDATE qrmktpl.url SET qrcodeid=$1 WHERE id=$2;',
                    [
                        qrId,
                        urlresult?.rows[0]?.id,
                    ])

            }
            const response = await this.client.query(
                'select id, location from qrmktpl.qrcodes where id=$1',
                [qrId]
            )
            return {
                type: 'ok',
                data: { type: 'resource', value: response.rows[0] },
            };


        } catch (err) {
            const error = new GeneralAPIError(
                Constants.errors.repo.qr.create.CODE,
                err
            )
                .withTitle(Constants.errors.repo.qr.create.TITLE)
                .withReason(Constants.errors.repo.qr.create.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    }


    save = async (
        id: Uuid,
        entity: Qr,
        context: IContext
    ): Promise<Result<Qr>> => {
        try {
            const now = new Date().toISOString();
            const errorCorrectionLevel = context.get('errorCorrectionLevel')
            const version = context.get('version')
            const quiteZone = context.get('quiteZone')
            const size = context.get('size')
            const encodingMode = context.get('encodingMode')
            const obj: any = {}
            obj.errorCorrectionLevel = errorCorrectionLevel
            obj.version = version
            obj.size = size
            obj.quiteZone = quiteZone
            obj.encodingMode = encodingMode

            const result = await this.client.query(
                `SELECT ${this.columns} FROM qrmktpl.qrcodes WHERE id=$1`,
                [id]
            );
            if (result.rowCount > 0) {
                const urll = await this.convertUrl(entity?.location, obj)
                const updateResult = await this.client.query(
                    'UPDATE qrmktpl.qrcodes SET location=$1,  modified_at=$2, modified_by=$3 WHERE id=$4;',
                    [
                        urll,
                        now,
                        Uuid(),
                        id,
                    ])
                if (updateResult.rowCount > 0) {
                    return this.handleResult(result, 'resource');
                }
                else {
                    return this.handleResourceNotFound(id);
                }

            }

            if (result.rowCount === 0) {
                return this.handleResourceNotFound(id);
            }

            // const selectResult = await this.client.query(
            //     `SELECT ${this.columns} FROM mktpl.qr WHERE id=$1`,
            //     [id]
            // );

            // if (selectResult.rowCount >= 1) {
            //     return this.handleResult(selectResult, 'resource');
            // } else {
            //     return this.handleResourceNotFound(id);
            // }
        } catch (err) {
            const error = new GeneralAPIError(
                Constants.errors.repo.qr.save.CODE,
                err
            )
                .withTitle(Constants.errors.repo.qr.save.TITLE)
                .withReason(Constants.errors.repo.qr.save.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    };

    delete = async (id: Uuid, context: IContext): Promise<Result<Qr>> => {
        try {
            const now = new Date().toISOString();
            const result1 = await this.client.query(
                'UPDATE qrmktpl.qrcodes SET deleted_at=$1, deleted_by=$2 WHERE id=$3 AND deleted_at IS NULL;',
                [now, Uuid(), id]
            );
            if (result1.rowCount >= 1) {
                try {
                    const result = await this.client.query(
                        `SELECT ${this.columns} FROM qrmktpl.qrcodes WHERE id=$1`,
                        [id]
                    );

                    if (result.rowCount >= 1) {
                        return this.handleResult(result, 'resource');
                    } else {
                        return this.handleResourceNotFound(id);
                    }
                } catch (err) {
                    const error = new GeneralAPIError(
                        Constants.errors.repo.qr.innerDelete.CODE,
                        err
                    )
                        .withTitle(
                            Constants.errors.repo.qr.innerDelete.TITLE
                        )
                        .withReason(
                            Constants.errors.repo.qr.innerDelete.MESSAGE
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
                Constants.errors.repo.qr.delete.CODE,
                err
            )
                .withTitle(Constants.errors.repo.qr.delete.TITLE)
                .withReason(Constants.errors.repo.qr.delete.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    };

    convertDate = (date: any) => {
        const [year, month, day] = date.split('-');
        const formattedDate = new Date(`${month}-${day}-${year}`);
        formattedDate.setDate(formattedDate.getDate() + 1)
        return formattedDate.toISOString()
    }

    all = async (_context: IContext): Promise<Result<Qr>> => {
        const id: [unknown] = _context.get('ids')
        //const urls: [unknown] = _context.get('urls')
        const createdBy: [unknown] = _context.get('createdBy')
        const limit = _context.get('limit');
        const offset = _context.get('offset');
        const startDate = _context.get('startDate') ? this.convertDate(_context.get('startDate')) : null;
        const endDate = _context.get('endDate') ? this.convertDate(_context.get('endDate')) : null;
        let tempIndex = 1;
        let temp = [];
        let query=  `SELECT q.id , q.location,q.created_by , u.urlName as Url
                FROM qrmktpl.qrcodes q
                JOIN qrmktpl.url u ON q.id = u.qrcodeId WHERE q.deleted_at IS NULL`
                
       
                if (id?.length > 0) {
                    temp.push(id)
                    query += ` and q.id::uuid = ANY($${tempIndex}::uuid[])`
                    tempIndex++
                }
                if (createdBy?.length > 0) {
                    temp.push(createdBy)
                    query += ` and q.created_by::uuid = ANY($${tempIndex}::uuid[]) `
                    tempIndex++
                }
                if (startDate != null && endDate != null) {
                    temp.push(startDate)
                    temp.push(endDate)
                    tempIndex = tempIndex + 1
                    query += ` and q.created_at BETWEEN to_timestamp($${tempIndex-1}, 'YYYY-MM-DD') 
                          AND to_timestamp($${tempIndex}, 'YYYY-MM-DD')`
                    tempIndex++      
                }
                temp.push(limit)
                temp.push(offset)
                query+=` ORDER BY q.created_at DESC LIMIT $${tempIndex} OFFSET $${tempIndex+1}`
                try {    
            const res = await this.client.query(query,temp)
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
                Constants.errors.repo.qr.all.CODE,
                err
            )
                .withTitle(Constants.errors.repo.qr.all.TITLE)
                .withReason(Constants.errors.repo.qr.all.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    };

    findById = async (
        id: Uuid,
        _context: IContext
    ): Promise<Result<Qr>> => {
        try {
            const res = await this.client.query(
                `SELECT ${this.columns} FROM qrmktpl.qrcodes WHERE id=$1 AND deleted_at IS NULL`,
                [id]
            );

            if (res.rowCount >= 1) {
                return this.handleResult(res, 'resource');
            } else {
                return this.handleResourceNotFound(id);
            }
        } catch (err) {
            const error = new GeneralAPIError(
                Constants.errors.repo.qr.find.CODE,
                err
            )
                .withTitle(Constants.errors.repo.qr.find.TITLE)
                .withReason(Constants.errors.repo.qr.find.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    };



    handleResourceNotFound = (id: Uuid): Result<Qr> => {
        const error = new ResourceNotFoundError(
            Constants.errors.notFound.qr.CODE
        )
            .withTitle(Constants.errors.notFound.qr.TITLE)
            .withReason(
                formatString(Constants.errors.notFound.qr.MESSAGE, id)
            );

        return {
            type: 'error',
            data: error,
        };
    };

    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    buildQr = (element: any): Qr => {
        
        const qr: Qr = new Qr(
            element.id,
            element.location,
            element.created_by,
            element.url
        );
        return qr;
    };

    handleResult = (res: Pg.QueryResult, type: string): Result<Qr> => {
        const val: Qr[] = [];
        res.rows.forEach((element) => {
            const qr: Qr = this.buildQr(element);
            val.push(qr);
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
