/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    IHandler,
    IService,
    IResource,
    Result,
    IRequest,
    PathParams,
} from '@litmus7/apip-api-types';
import { match } from 'ts-pattern';
import { validate as uuidValidate } from 'uuid';
import { FastifyReply } from 'fastify';
import { Attachments, AttachmentsSchema } from '../models/attachment';
import {
    ValidationAPIError,
    ResourceNotFoundError,
    GeneralAPIError,
} from '../errors';
import { Constants } from '../models';
import { fastifyRequestContextMiddleware } from '@litmus7/apip-context-middleware'
import { connectToBlobService } from '../utils/azure.blob.storage';

export class AttachmentHandler implements IHandler {

    attachmentService: IService<Attachments>;

    constructor(attachmentService: IService<Attachments>) {
        this.attachmentService = attachmentService;
    }

    get = async (req: IRequest<Attachments>, reply: any) => {
        try {
            const params = req.apip.ctx.get<PathParams>('request:pathparams');


            if (params.id === undefined) {
                return this.getCollection(req, reply);
            }

            if (!uuidValidate(params.id)) {
                throw new ValidationAPIError(
                    Constants.errors.handler.attachment.get.CODE
                );
            }

            const result: any = await this.attachmentService.getById(
                params.id,
                req.apip.ctx
            );
            if (!(req.headers.accept === result?.mimeType)) {
                match(result)
                    .with({ type: 'ok' }, async (res: any) => {
                        const result: IResource[] = [];
                        result.push(res.data.value);

                        reply.type('application/json').code(200).send(result);


                    })
                    .with({ type: 'error' }, (res: any) => {
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
            }
            else {
                if (result.type === 'ok') {
                    await this.downloadAttachment(result.data.value, reply)
                }
                if (result.type === 'error') {
                    throw new Error(result.data)
                }
            }
        } catch (error) {
            this.handleError(
                req,
                error,
                reply,
                Constants.errors.handler.attachment.get.CODE,
                Constants.errors.handler.attachment.get.MESSAGE,
                Constants.errors.handler.attachment.get.TITLE
            );
        }
    };

    getCollection = async (req: IRequest<Attachments>, reply: FastifyReply) => {
        const result = await this.attachmentService.getCollection(req.apip.ctx);
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

    post = async (req: any, reply: FastifyReply) => {
        const attachment = await req.file();
        const error = false
        if (error) {
            this.handleValidationError(
                error,
                reply,
                Constants.errors.validation.attachment.create.CODE,
                Constants.errors.validation.attachment.create.MESSAGE,
                Constants.errors.validation.attachment.update.TITLE
            );
        } else {
            const result = await this.attachmentService.create(
                attachment,
                req.apip.ctx
            );
            this.matchOkOrError(201, result, reply);
        }
    };

    put = async (req: IRequest<Attachments>, reply: FastifyReply) => {
        try {
            const { body: attachment } = req;
            const params = req.apip.ctx.get<PathParams>('request:pathparams');
            if (!uuidValidate(params.id)) {
                throw new ValidationAPIError(
                    Constants.errors.handler.attachment.get.CODE
                );
            }

            const { value: validattachment, error } = AttachmentsSchema.validate(attachment);

            if (error) {
                this.handleValidationError(
                    error,
                    reply,
                    Constants.errors.validation.attachment.update.CODE,
                    Constants.errors.validation.attachment.update.MESSAGE,
                    Constants.errors.validation.attachment.update.TITLE
                );
            } else {
                const result = await this.attachmentService.update(
                    params.id,
                    validattachment,
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
                        Constants.errors.handler.attachment.update.CODE,
                        Constants.errors.handler.attachment.update.MESSAGE,
                        Constants.errors.handler.attachment.update.TITLE
                    )
                );
        }
    };

    delete = async (req: IRequest<Attachments>, reply: FastifyReply) => {
        try {
            const params = req.apip.ctx.get<PathParams>('request:pathparams');
            if (!uuidValidate(params.id)) {
                throw new ValidationAPIError(
                    Constants.errors.handler.attachment.get.CODE
                );
            }

            const result = await this.attachmentService.delete(
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
                Constants.errors.handler.attachment.delete.CODE,
                Constants.errors.handler.attachment.delete.MESSAGE,
                Constants.errors.handler.attachment.delete.TITLE
            );
        }
    };


    downloadAttachment = async (attachmentDetails: any, reply: FastifyReply) => {
        const { blobServiceClient } = await connectToBlobService()
        // eslint-disable-next-line prefer-template
        const blobName = 'das-attachments/' + attachmentDetails.path
        const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_CONTAINER_NAME)
        const blockBlobClient = containerClient.getBlockBlobClient(blobName)
        try {
            const response = await blockBlobClient.download(0);
            reply.raw.writeHead(200, {
                'Content-Type': response.contentType,
                'Content-Length': response.contentLength,
                'Content-Disposition': `attachment; filename=${attachmentDetails.name}`,
            });
            response.readableStreamBody.pipe(reply.raw);
        } catch (error) {
            reply.status(500).send({ error: 'Failed to download file' });
        }
    }
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
        result: Result<Attachments>,
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
        req: IRequest<Attachments>,
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
