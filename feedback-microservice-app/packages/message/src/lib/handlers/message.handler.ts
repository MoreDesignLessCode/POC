import {
    IHandler,
    IService,
    IResource,
    Result,
    IRequest,
    PathParams,
    QueryParameters,
    ResponseBuilder
} from '@litmus7/apip-api-types';
import { match } from 'ts-pattern';
import { validate as uuidValidate } from 'uuid';
import { FastifyReply } from 'fastify';
import { MessageArraySchema, Messages, MessageSchema } from '../models/message';
import {
    ValidationAPIError,
    ResourceNotFoundError,
    GeneralAPIError,
} from '../errors';
import { Constants } from '../models';
// needed to wire apip.ctx to req
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { fastifyRequestContextMiddleware } from '@litmus7/apip-context-middleware'

export class MessageHandler implements IHandler {
    messageService: IService<Messages>;
    responseBuilder: ResponseBuilder

    constructor(messageService: IService<Messages>) {
        this.messageService = messageService;
        this.responseBuilder = new ResponseBuilder()
    }

    get = async (req: IRequest<Messages>, reply: FastifyReply) => {
        try {
            const params = req.apip.ctx.get<PathParams>('request:pathparams');
            const queryParams: any = req.query
            const reference = queryParams?.reference
            req.apip.ctx.set<QueryParameters>('reference', reference)
            const requestType = queryParams?.artifactType
            const ids = queryParams?.id
            req.apip.ctx.set<QueryParameters>('artifactType', requestType)
            req.apip.ctx.set<QueryParameters>('id', ids)

            if (params.id === undefined) {
                return this.getCollection(req, reply);
            }

            if (!uuidValidate(params.id)) {
                throw new ValidationAPIError(
                    Constants.errors.handler.message.get.CODE
                );
            }
            //comment

            const result = await this.messageService.getById(params.id, req.apip.ctx);
            match(result)
                .with({ type: 'ok' }, (res) => {
                    const result: any = res.data.value
                    this.responseBuilder.setData(result)
                    reply.type('application/json').code(200).send(this.responseBuilder.build());
                })
                .with({ type: 'error' }, (res) => {
                    const error = res.data;
                    if (error instanceof ResourceNotFoundError) {
                        const result: IResource[] = [];
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
                Constants.errors.handler.message.get.CODE,
                Constants.errors.handler.message.get.MESSAGE,
                Constants.errors.handler.message.get.TITLE
            );
        }
    };

    getCollection = async (req: IRequest<Messages>, reply: FastifyReply) => {
        const params = req.apip.ctx.get<PathParams>('request:pathparams');
        const queryParams: any = req.query
        const requestType = queryParams?.artifactType
        req.apip.ctx.set<QueryParameters>('artifactType', requestType)
        const result = await this.messageService.getCollection(req.apip.ctx);
        match(result)
            .with({ type: 'ok' }, (result) => {
                const res: any = result.data.value
                this.responseBuilder.setData(res)
                reply
                    .type('application/json')
                    .code(200)
                    .send(this.responseBuilder.build())
            })
            .with({ type: 'error' }, (result) => {
                reply
                    .type('application/json')
                    .code(400)
                    .send(result.data.toJson());
            })
            .exhaustive();
    };

    post = async (req: IRequest<Messages>, reply: FastifyReply) => {
        const { body: messages } = req;
        messages.map(message=>{
            const splitString = message?.reference.split(":");
            const values = splitString.slice(splitString.indexOf("v1") + 1);
            const artifactType = values[0].toUpperCase();
            const id = values[1];//id of ticket or rating
            message.artifactType = artifactType;
            message.artifactIdValue = id
            delete message.reference;
        })
      
        const { value: validMessage, error } = MessageArraySchema.validate(messages);
        console.log(validMessage,error)
        if (error) {
            const validationError = new ValidationAPIError(
                Constants.errors.validation.message.create.CODE,
                error
            )
                .withReason(Constants.errors.validation.message.create.MESSAGE)
                .withTitle(Constants.errors.validation.message.create.TITLE);
            reply
                .type('application/json')
                .code(400)
                .send(validationError.toJson());
        } else {
            const result = await this.messageService.create(validMessage, req.apip.ctx);
            this.matchOkOrError(result, reply, 201);
        }
    };

    put = async (req: IRequest<Messages>, reply: FastifyReply) => {
        try {
            const { body: message } = req;
            const params = req.apip.ctx.get<PathParams>('request:pathparams');
            // if (!uuidValidate(params.id)) {
            //     throw new ValidationAPIError(
            //         Constants.errors.handler.message.get.CODE
            //     );
            // }

            const { value: validMessage, error } = MessageSchema.validate(message);
            console.log(validMessage)
            if (error) {
                const validationError = new ValidationAPIError(
                    Constants.errors.validation.message.update.CODE,
                    error
                )
                    .withReason(
                        Constants.errors.validation.message.update.MESSAGE
                    )
                    .withTitle(Constants.errors.validation.message.update.TITLE);
                reply
                    .type('application/json')
                    .code(400)
                    .send(validationError.toJson());
            } else {
                const result = await this.messageService.update(
                    params.id,
                    validMessage,
                    req.apip.ctx
                );
                this.matchOkOrError(result, reply, 200);
            }
        } catch (error) {
            req.log.error(error);
            reply
                .type('application/json')
                .code(400)
                .send(
                    this.generateGenericError(
                        error as Error,
                        Constants.errors.handler.message.update.CODE,
                        Constants.errors.handler.message.update.MESSAGE,
                        Constants.errors.handler.message.update.TITLE
                    )
                );
        }
    };

    delete = async (req: IRequest<Messages>, reply: FastifyReply) => {
        try {
            const params = req.apip.ctx.get<PathParams>('request:pathparams');
            if (!uuidValidate(params.id)) {
                throw new ValidationAPIError(
                    Constants.errors.handler.message.get.CODE
                );
            }

            const result = await this.messageService.delete(params.id, req.apip.ctx);
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
                Constants.errors.handler.message.delete.CODE,
                Constants.errors.handler.message.delete.MESSAGE,
                Constants.errors.handler.message.delete.TITLE
            );
        }
    };
    handleError = (
        req: IRequest<Messages>,
        error: unknown,
        reply: FastifyReply,
        code: string,
        message: string,
        title: string
    ) => {
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
    ): unknown => {
        return new GeneralAPIError(code, error)
            .withReason(reason)
            .withTitle(title)
            .toJson();
    };

    matchOkOrError = (
        result: Result<Messages>,
        reply: FastifyReply,
        statusCode: number
    ) => {
        match(result)
            .with({ type: 'ok' }, (result) => {
                const response: any = result.data.value
                this.responseBuilder.setData(response)
                reply
                    .type('application/json')
                    .code(statusCode)
                    .send(this.responseBuilder.build())
            })
            .with({ type: 'error' }, (result) => {
                reply
                    .type('application/json')
                    .code(400)
                    .send(result.data.toJson());
            })
            .exhaustive();
    };
}
