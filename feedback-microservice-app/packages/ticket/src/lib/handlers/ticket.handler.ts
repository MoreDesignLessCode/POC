/* eslint-disable prefer-const */
import {
    IHandler,
    IService,
    IResource,
    Result,
    IRequest,
    PathParams,
    QueryParameters,
    ResponseBuilder,
    Uuid,APIError
} from '@litmus7/apip-api-types';
import { match } from 'ts-pattern';
import { validate as uuidValidate } from 'uuid';
import { FastifyReply } from 'fastify';
import { Tickets, TicketSchema } from '../models/ticket';
import {
    ValidationAPIError,
    ResourceNotFoundError,
    GeneralAPIError,
} from '../errors';
import { Constants } from '../models';
// needed to wire apip.ctx to req
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { fastifyRequestContextMiddleware } from '@litmus7/apip-context-middleware';




export class TicketHandler implements IHandler {

    ticketService: IService<Tickets>

    constructor(ticketService: IService<Tickets>) {
        this.ticketService = ticketService;
    }

    get = async (req: IRequest<Tickets>, reply: FastifyReply) => {
        const responseBuilder = new ResponseBuilder();
        try {
            const params = req.apip.ctx.get<PathParams>('request:pathparams');
            const queryParams: any = req.query
            const includesParams = queryParams?.includes?.split(',') || []
            const requestTicketIds = queryParams['filter.id']?.split(',') || []
            req.apip.ctx.set<QueryParameters>('ids', requestTicketIds)
            req.apip.ctx.set<QueryParameters>('includes', includesParams)


            if (params.id === undefined) {
                return this.getCollection(req, reply);
            }

            if (!uuidValidate(params.id)) {
                throw new ValidationAPIError(
                    Constants.errors.handler.ticket.get.CODE
                );
            }

            let ticketdata = []
            let messagesArr = [];
            let participantsArr = [];
            let attachmentsArr = [];
            const result = await this.ticketService.getById(params.id, req.apip.ctx);
            match(result)
                .with({ type: 'ok' }, (result) => {
                    const response: any = result.data.value
                    response?.map(({ messages, attachments, ...rest }) => {
                        ticketdata.push(rest);
                        if (messages) {
                            messagesArr.push(...messages)
                        }
                        if (attachments) {
                            attachmentsArr.push(...attachments)
                        }
                    });
                    responseBuilder.setData(ticketdata);
                    messagesArr.length > 0 ? responseBuilder.addIncludes('messages', messagesArr) : null
                    attachmentsArr.length > 0 ? responseBuilder.addIncludes('attachments', attachmentsArr) : null
                    reply
                        .type('application/json')
                        .code(200)
                        .send(responseBuilder.build());
                })
                .with({ type: 'error' }, (res) => {
                    const error = res.data;
                    if (error instanceof ResourceNotFoundError) {
                        responseBuilder.setData([]);
                        reply
                            .type('application/json')
                            .code(200)
                            .send(responseBuilder.build());
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
            req.log.error(error);
            reply
                .type('application/json')
                .code(400)
                .send(
                    this.generateGenericError(
                        error as Error,
                        Constants.errors.handler.ticket.get.CODE,
                        Constants.errors.handler.ticket.get.MESSAGE,
                        Constants.errors.handler.ticket.get.TITLE
                    )
                );
        }
    };


    getCollection = async (req: IRequest<Tickets>, reply: FastifyReply) => {
        const responseBuilder = new ResponseBuilder();
        const result = await this.ticketService.getCollection(req.apip.ctx);
        let ticketdata = []
        let messagesArr = [];
        let participantsArr = [];
        let attachmentsArr = [];
        match(result)
            .with({ type: 'ok' }, (result) => {
                const response: any = result.data.value
                response?.map(({ messages, attachments, ...rest }) => {
                    ticketdata.push(rest);
                    if (messages) {
                        messagesArr.push(...messages)
                    }
                    if (attachments) {
                        attachmentsArr.push(...attachments)
                    }
                });
                responseBuilder.setData(ticketdata);
                messagesArr.length > 0 ? responseBuilder.addIncludes('messages', messagesArr) : null
                attachmentsArr.length > 0 ? responseBuilder.addIncludes('attachments', attachmentsArr) : null
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
    }


    post = async (req: IRequest<Tickets>, reply: FastifyReply) => {
        const responseBuilder = new ResponseBuilder();
        const { body: ticket } = req;
        const { value: validTicket, error } = TicketSchema.validate(ticket, {
            stripUnknown: true,
        })
        let createdUserId = Uuid();  //Replace it with the profileID from Token
        let participantIds = []
        validTicket?.participants?.map((participant) => {
            participantIds.push(participant?.profileId)
        })
        if (!participantIds.includes(createdUserId)) {
            validTicket.participants.push(
                { profileId: createdUserId, status: "RESPONSIBLE", addedBy: createdUserId }
            )
        }
        if (error) {
            const validationError = new ValidationAPIError(
                Constants.errors.validation.ticket.create.CODE,
                error
            )
                .withReason(Constants.errors.validation.ticket.create.MESSAGE)
                .withTitle(Constants.errors.validation.ticket.create.TITLE);
                responseBuilder.setErrors(validationError);
            reply
                .type('application/json')
                .code(400)
                .send(responseBuilder.build());
        }
        else {
            const result = await this.ticketService.create(validTicket, req.apip.ctx);
            this.matchOkOrError(result, reply, 201);
        }

    };


    put = async (req: IRequest<Tickets>, reply: FastifyReply) => {
        const responseBuilder = new ResponseBuilder();
        try {
            const { body: ticket } = req;
            const params = req.apip.ctx.get<PathParams>('request:pathparams');
            if (!uuidValidate(params.id)) {
                throw new ValidationAPIError(
                    Constants.errors.handler.ticket.get.CODE
                );
            }

            const { value: validTicket, error } = TicketSchema.validate(ticket);

            if (error) {
                const validationError = new ValidationAPIError(
                    Constants.errors.validation.ticket.update.CODE,
                    error
                )
                    .withReason(
                        Constants.errors.validation.ticket.update.MESSAGE
                    )
                    .withTitle(Constants.errors.validation.ticket.update.TITLE);
                    responseBuilder.setErrors(validationError);
                reply
                    .type('application/json')
                    .code(400)
                    .send(responseBuilder.build());
            } else {
                const result = await this.ticketService.update(
                    params.id,
                    validTicket,
                    req.apip.ctx
                );
                this.matchOkOrError(result, reply, 200);
            }
        } catch (error) {
            req.log.error(error);
            responseBuilder.setErrors(
                this.generateGenericError(
                    error as Error,
                    Constants.errors.handler.ticket.update.CODE,
                    Constants.errors.handler.ticket.update.MESSAGE,
                    Constants.errors.handler.ticket.update.TITLE
                )
            );
            reply
                .type('application/json')
                .code(400)
                .send(responseBuilder.build());
        }
    };



    delete = async (req: IRequest<Tickets>, reply: FastifyReply) => {
        const responseBuilder = new ResponseBuilder();
        try {
            const params = req.apip.ctx.get<PathParams>('request:pathparams');
            if (!uuidValidate(params.id)) {
                throw new ValidationAPIError(
                    Constants.errors.handler.ticket.get.CODE
                );
            }
            const result = await this.ticketService.delete(params.id, req.apip.ctx);
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
                Constants.errors.handler.ticket.delete.CODE,
                Constants.errors.handler.ticket.delete.MESSAGE,
                Constants.errors.handler.ticket.delete.TITLE
            );
        }
    };


    handleError = (
        req: IRequest<Tickets>,
        error: unknown,
        reply: FastifyReply,
        code: string,
        message: string,
        title: string
    ) =>  {
        const responseBuilder = new ResponseBuilder();
        req.log.error(error);
        responseBuilder.setErrors(
            this.generateGenericError(error as Error, code, message, title)
        );
        reply.type('application/json').code(400).send(responseBuilder.build());
    };

    generateGenericError = (
        error: Error,
        code: string,
        reason: string,
        title: string
    ): APIError => {
        return new GeneralAPIError(code, error)
            .withReason(reason)
            .withTitle(title)
    };


    matchOkOrError = (
        result: Result<Tickets>,
        reply: FastifyReply,
        statusCode: number
    ) => {
        const responseBuilder = new ResponseBuilder();
        match(result)
            .with({ type: 'ok', data: { type: 'resource' } }, (result) => {
                responseBuilder.setData([result.data.value]);
                reply
                    .type('application/json')
                    .code(statusCode)
                    .send(responseBuilder.build());
            })
            .with({ type: 'ok', data: { type: 'collection' } }, (result) => {
                responseBuilder.setData(result.data.value);
                reply
                    .type('application/json')
                    .code(statusCode)
                    .send(responseBuilder.build());
            })
            .with({ type: 'error' }, (result) => {
                responseBuilder.setErrors(result.data);
                reply
                    .type('application/json')
                    .code(400)
                    .send(responseBuilder.build());
            })
            .exhaustive();
    };
}
