/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    IHandler,
    IService,
    IResource,
    Result,
    IRequest,
    PathParams,
    QueryParameters,
    ResponseBuilder
} from '@procter-gamble/apip-api-types';
import { match } from 'ts-pattern';
import { validate as uuidValidate } from 'uuid';
import { FastifyReply } from 'fastify';
import { Url, UrlSchema } from '../models/url';
import { fastifyRequestContextMiddleware } from '@procter-gamble/apip-context-middleware'
//
import {
    ValidationAPIError,
    ResourceNotFoundError,
    GeneralAPIError,
} from '../errors';
import { Constants } from '../models';

export class UrlHandler implements IHandler {
    urlService: IService<Url>;

    constructor(urlService: IService<Url>) {
        this.urlService = urlService;
    }

    get = async (req: IRequest<Url>, reply: FastifyReply) => {
        const responseBuilder = new ResponseBuilder();
        try {
            const params = req.apip.ctx.get<PathParams>('request:pathparams');
            const queryParams: any = req.query
            const requestTicketIds = queryParams['filter.id']?.split(',') || []
            if (req.url.includes('getOrginal')) {
                const urlNames = queryParams['urls']?.split(',') || []
                req.apip.ctx.set<QueryParameters>('urls', urlNames)
            }
            req.apip.ctx.set<QueryParameters>('ids', requestTicketIds)

            if (params.id === undefined) {
                return this.getCollection(req, reply);
            }

            if (!uuidValidate(params.id)) {
                throw new ValidationAPIError(
                    Constants.errors.handler.url.get.CODE
                );
            }

            const result = await this.urlService.getById(
                params.id,
                req.apip.ctx
            );
            match(result)
                .with({ type: 'ok' }, (res) => {
                    const result: IResource[] = [];
                    result.push(res.data.value);
                    responseBuilder.setData(result);
                    reply.type('application/json').code(200).send(responseBuilder.build());
                })
                .with({ type: 'error' }, (res) => {
                    const error = res.data;
                    if (error instanceof ResourceNotFoundError) {
                        responseBuilder.setData([]);
                        reply.type('application/json').code(200).send(responseBuilder.build());
                    } else {
                        responseBuilder.setErrors(error);
                        reply
                            .type('application/json')
                            .code(400)
                            .send(responseBuilder.build());
                    }
                })
                .exhaustive();
        } catch (error) {
            this.handleError(
                req,
                error,
                reply,
                Constants.errors.handler.url.get.CODE,
                Constants.errors.handler.url.get.MESSAGE,
                Constants.errors.handler.url.get.TITLE
            );
        }
    };

    getCollection = async (req: IRequest<Url>, reply: FastifyReply) => {
        const responseBuilder = new ResponseBuilder();
        const result = await this.urlService.getCollection(req.apip.ctx);
        match(result)
            .with({ type: 'ok' }, (res) => {
                const result: IResource[] = [];
                result.push(res.data.value);
                responseBuilder.setData(result);
                reply
                    .type('application/json')
                    .code(200)
                    .send(responseBuilder.build());
            })
            .with({ type: 'error' }, (result) => {
                reply
                    .type('application/json')
                    .code(400)
                    .send(responseBuilder.build());
            })
            .exhaustive();
    };

    post = async (req: IRequest<Url>, reply: FastifyReply) => {
        const requestUrl: any = req.url
        const parts = requestUrl.split("/");
        const method = parts.pop()
        req.apip.ctx.set<QueryParameters>('method', method)
        const responseBuilder = new ResponseBuilder();
        const { body: url } = req;

        const { value: validUrl, error } = UrlSchema.validate(url);

        if (error) {
            const validationError = new ValidationAPIError(
                Constants.errors.validation.url.create.CODE,
                error
            )
                .withReason(Constants.errors.validation.url.create.MESSAGE)
                .withTitle(Constants.errors.validation.url.create.TITLE);
            responseBuilder.setErrors(validationError);
            reply
                .type('application/json')
                .code(400)
                .send(responseBuilder.build());
        } else {
            const result = await this.urlService.create(
                validUrl,
                req.apip.ctx
            );
            this.matchOkOrError(201, result, reply);
        }
    };


    put = async (req: IRequest<Url>, reply: FastifyReply) => {
        const responseBuilder = new ResponseBuilder();
        try {
            const { body: url } = req;
            const params = req.apip.ctx.get<PathParams>('request:pathparams');
            // if (!uuidValidate(params.id)) {
            //     throw new ValidationAPIError(
            //         Constants.errors.handler.url.get.CODE
            //     );
            // }

            const { value: validUrl, error } = UrlSchema.validate(url);

            if (error) {
                const validationError = new ValidationAPIError(
                    Constants.errors.validation.url.update.CODE,
                    error
                )
                    .withReason(
                        Constants.errors.validation.url.update.MESSAGE
                    )
                    .withTitle(Constants.errors.validation.url.update.TITLE);
                responseBuilder.setErrors(validationError);
                reply
                    .type('application/json')
                    .code(400)
                    .send(responseBuilder.build());
            } else {
                const result = await this.urlService.update(
                    params.id,
                    validUrl,
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
                        Constants.errors.handler.url.update.CODE,
                        Constants.errors.handler.url.update.MESSAGE,
                        Constants.errors.handler.url.update.TITLE
                    )
                );
        }
    };

    delete = async (req: IRequest<Url>, reply: FastifyReply) => {
        const responseBuilder = new ResponseBuilder();
        try {
            const params = req.apip.ctx.get<PathParams>('request:pathparams');
            if (!uuidValidate(params.id)) {
                throw new ValidationAPIError(
                    Constants.errors.handler.url.get.CODE
                );
            }

            const result = await this.urlService.delete(
                params.id,
                req.apip.ctx
            );
            match(result)
                .with({ type: 'ok' }, () =>
                    reply.type('application/json').code(204).send()
                )
                .with({ type: 'error' }, (result) => {
                    responseBuilder.setErrors(result.data);
                    reply
                        .type('application/json')
                        .code(400)
                        .send(responseBuilder.build());
                })
                .exhaustive();
        } catch (error) {
            this.handleError(
                req,
                error,
                reply,
                Constants.errors.handler.url.delete.CODE,
                Constants.errors.handler.url.delete.MESSAGE,
                Constants.errors.handler.url.delete.TITLE
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
        result: Result<Url>,
        reply: FastifyReply
    ): void => {
        const responseBuilder = new ResponseBuilder();
        match(result)
            .with({ type: 'ok' }, (result) => {
                responseBuilder.setData([result.data.value])
                reply
                    .type('application/json')
                    .code(statusCode)
                    .send(responseBuilder.build());
            })
            .with({ type: 'error' }, (result) => {
                responseBuilder.setErrors(result.data);
                reply.log.error(result);
                reply
                    .type('application/json')
                    .code(400)
                    .send(responseBuilder.build());
            })
            .exhaustive();
    };

    handleError = (
        req: IRequest<Url>,
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
