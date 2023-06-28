import {
    IHandler,
    IService,
    IResource,
    Result,
    IRequest,
    PathParams,
    QueryParameters,
    ResponseBuilder
} from '@coe/apip-api-types';
import { match } from 'ts-pattern';
import { validate as uuidValidate } from 'uuid';
import { FastifyReply } from 'fastify';
import { Qr, QrSchema, schema } from '../models/qr';
import {
    ValidationAPIError,
    ResourceNotFoundError,
    GeneralAPIError,
} from '../errors';
import { Constants } from '../models';
import { fastifyRequestContextMiddleware } from '@coe/apip-context-middleware'

export class QrHandler implements IHandler {
    qrService: IService<Qr>;

    constructor(qrService: IService<Qr>) {
        this.qrService = qrService;
    }

    get = async (req: IRequest<Qr>, reply: FastifyReply) => {
        try {
            const params = req.apip.ctx.get<PathParams>('request:pathparams');
            const queryParams: any = req.query
            const requestTicketIds = queryParams['filter.id']?.split(',') || []
            const createdByFilter = queryParams['filter.createdBy']?.split(',') || []
            const dateRange = queryParams['filter.dateRange']?.split('~') || [];
            const limit = queryParams['limit'] || 10;
            const offset = queryParams['offset'] || 0;
            req.apip.ctx.set<QueryParameters>('limit', limit)
            req.apip.ctx.set<QueryParameters>('offset', offset)

            if (dateRange.length > 0) {
                const startDate = dateRange[0];
                const endDate = dateRange[1];
                req.apip.ctx.set<QueryParameters>('startDate', startDate)
                req.apip.ctx.set<QueryParameters>('endDate', endDate)
            }
            // if (req.url.includes('getOrginal')) {
            //     const urlNames = queryParams['urls']?.split(',') || []
            //     req.apip.ctx.set<QueryParameters>('urls', urlNames)
            // }
            req.apip.ctx.set<QueryParameters>('ids', requestTicketIds)
            req.apip.ctx.set<QueryParameters>('createdBy', createdByFilter)


            if (params.id === undefined) {
                return this.getCollection(req, reply);
            }

            if (!uuidValidate(params.id)) {
                throw new ValidationAPIError(
                    Constants.errors.handler.qr.get.CODE
                );
            }

            const result = await this.qrService.getById(
                params.id,
                req.apip.ctx
            );
            match(result)
                .with({ type: 'ok' }, (res) => {
                    const result: IResource[] = [];
                    result.push(res.data.value);
                    reply.type('application/json').code(200).send(result);
                })
                .with({ type: 'error' }, (res) => {
                    const error = res.data;
                    if (error instanceof ResourceNotFoundError) {
                        const result: IResource[] = [];
                        //result.push(res.data.val);
                        reply.type('application/json').code(200).send(result);
                    } else {
                        reply
                            .type('application/json')
                            .code(400)
                            .send(error.toJson());
                    }
                })
                .exhaustive();
        } catch (error) {
            this.handleError(
                req,
                error,
                reply,
                Constants.errors.handler.qr.get.CODE,
                Constants.errors.handler.qr.get.MESSAGE,
                Constants.errors.handler.qr.get.TITLE
            );
        }
    };

    getCollection = async (req: IRequest<Qr>, reply: FastifyReply) => {
        const result = await this.qrService.getCollection(req.apip.ctx);
        match(result)
            .with({ type: 'ok' }, (result) => {
                reply
                    .type('application/json')
                    .code(200)
                    .send(result.data.value);
            })
            .with({ type: 'error' }, (result) => {
                reply
                    .type('application/json')
                    .code(400)
                    .send(result.data.toJson());
            })
            .exhaustive();
    };

    post = async (req: IRequest<Qr>, reply: FastifyReply) => {
        const { body: qr } = req;
        const queryParams: any = req.query
        const errorCorrectionLevel = queryParams?.errorCorrectionLevel
        const version = queryParams?.version
        const quiteZone = queryParams?.quiteZone
        const size = queryParams?.size
        const encodingMode = queryParams?.encodingMode
        req.apip.ctx.set<QueryParameters>('errorCorrectionLevel', errorCorrectionLevel)
        req.apip.ctx.set<QueryParameters>('version', version)
        req.apip.ctx.set<QueryParameters>('quiteZone', quiteZone)
        req.apip.ctx.set<QueryParameters>('size', size)
        req.apip.ctx.set<QueryParameters>('encodingMode', encodingMode)
        const { value: validQr, error } = schema.validate(qr)
        if (error) {
            this.handleValidationError(
                error,
                reply,
                Constants.errors.validation.qr.create.CODE,
                Constants.errors.validation.qr.create.MESSAGE,
                Constants.errors.validation.qr.update.TITLE
            );
        } else {
            if (Array.isArray(validQr)) {
                let resp = await Promise.all(validQr.map(async (qrUrl) => await this.qrService.create(
                    qrUrl,
                    req.apip.ctx
                )))

                const consolidatedResponse = resp.reduce((result, response: any) => {
                    result.data.push(response.data.value);
                    return result;
                }, { type: 'ok', data: [] });

                console.log(consolidatedResponse);
                reply
                    .type('application/json')
                    .code(200)
                    .send(consolidatedResponse);
            }
            else {
                const result = await this.qrService.create(
                    validQr,
                    req.apip.ctx
                );
                this.matchOkOrError(201, result, reply);
            }
        }
    };

    put = async (req: IRequest<Qr>, reply: FastifyReply) => {
        try {
            const { body: qr } = req;
            const params = req.apip.ctx.get<PathParams>('request:pathparams');
            const queryParams: any = req.query
            const errorCorrectionLevel = queryParams?.errorCorrectionLevel
            const mask = queryParams?.mask
            const quiteZone = queryParams?.quiteZone
            const size = queryParams?.sizeconst
            const encodingMode = queryParams?.encodingMode
            req.apip.ctx.set<QueryParameters>('errorCorrectionLevel', errorCorrectionLevel)
            req.apip.ctx.set<QueryParameters>('mask', mask)
            req.apip.ctx.set<QueryParameters>('quiteZone', quiteZone)
            req.apip.ctx.set<QueryParameters>('size', size)
            req.apip.ctx.set<QueryParameters>('encodingMode', encodingMode)
            if (!uuidValidate(params.id)) {
                throw new ValidationAPIError(
                    Constants.errors.handler.qr.get.CODE
                );
            }

            //const { value: validQr, error } = QrSchema.validate(qr);
            let error = false
            if (error) {
                this.handleValidationError(
                    error,
                    reply,
                    Constants.errors.validation.qr.update.CODE,
                    Constants.errors.validation.qr.update.MESSAGE,
                    Constants.errors.validation.qr.update.TITLE
                );
            } else {
                const result = await this.qrService.update(
                    params.id,
                    //validQr,
                    qr,
                    req.apip.ctx
                );
                this.matchOkOrError(200, result, reply);
            }
        } catch (error) {
            req.log.error(error);
            reply
                .type('application/json')
                .code(400)
                .send(
                    this.generateGenericError(
                        error as Error,
                        Constants.errors.handler.qr.update.CODE,
                        Constants.errors.handler.qr.update.MESSAGE,
                        Constants.errors.handler.qr.update.TITLE
                    )
                );
        }
    };

    delete = async (req: IRequest<Qr>, reply: FastifyReply) => {
        try {
            const params = req.apip.ctx.get<PathParams>('request:pathparams');
            if (!uuidValidate(params.id)) {
                throw new ValidationAPIError(
                    Constants.errors.handler.qr.get.CODE
                );
            }

            const result = await this.qrService.delete(
                params.id,
                req.apip.ctx
            );
            match(result)
                .with({ type: 'ok' }, () =>
                    reply.type('application/json').code(204).send()
                )
                .with({ type: 'error' }, (result) => {
                    const error = result.data;
                    reply
                        .type('application/json')
                        .code(400)
                        .send(error.toJson());
                })
                .exhaustive();
        } catch (error) {
            this.handleError(
                req,
                error,
                reply,
                Constants.errors.handler.qr.delete.CODE,
                Constants.errors.handler.qr.delete.MESSAGE,
                Constants.errors.handler.qr.delete.TITLE
            );
        }
    };

    handleValidationError = (
        error: unknown,
        reply: FastifyReply,
        code: string,
        message: string,
        title: string
    ): void => {
        reply.log.error(error);
        const validationError = new ValidationAPIError(code, error)
            .withReason(message)
            .withTitle(title);
        reply.type('application/json').code(400).send(validationError.toJson());
    };

    matchOkOrError = (
        statusCode: number,
        result: Result<Qr>,
        reply: FastifyReply
    ): void => {
        match(result)
            .with({ type: 'ok' }, (result) =>
                reply
                    .type('application/json')
                    .code(statusCode)
                    .send(result.data.value)
            )
            .with({ type: 'error' }, (result) => {
                reply.log.error(result);
                reply
                    .type('application/json')
                    .code(400)
                    .send(result.data.toJson());
            })
            .exhaustive();
    };

    handleError = (
        req: IRequest<Qr>,
        error: Error,
        reply: FastifyReply,
        code: string,
        message: string,
        title: string
    ): void => {
        req.log.error(error);
        reply
            .type('application/json')
            .code(400)
            .send(
                this.generateGenericError(error as Error, code, message, title)
            );
    };

    generateGenericError = (
        error: Error,
        code: string,
        reason: string,
        title: string
    ): object => {
        return new GeneralAPIError(code, error)
            .withReason(reason)
            .withTitle(title)
            .toJson();
    };
}
