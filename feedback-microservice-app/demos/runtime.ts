import {
    TicketHandler,
    TicketPgStorageProvider,
    TicketRepository,
    TicketRouter,
    TicketService
} from '../dist/packages/ticket';
import {
    RatingHandler,
    RatingPgStorageProvider,
    RatingRepository,
    RatingRouter,
    RatingService
} from '../dist/packages/rating';

import {
    MessageHandler,
    MessagePgStorageProvider,
    MessageRepository,
    MessageRouter,
    MessageService
} from '../dist/packages/message';
import {
    AttachmentHandler,
    AttachmentPgStorageProvider,
    AttachmentRepository,
    AttachmentRouter,
    AttachmentService
} from '../dist/packages/attachment';

import { FastifyHttpProvider } from '../dist/packages/api';
import * as dotenv from 'dotenv';
import { fastifyRequestContextMiddleware } from '../dist/packages/context';
import { JwtMiddleware, JwtOptions } from '../dist/packages/jwt';
import cors from '@fastify/cors'


dotenv.config();

const port = process.env.FEEDBACK_DAS_PORT || 3000;
const Runtime = new FastifyHttpProvider({ logger: true });

Runtime.instance.register(fastifyRequestContextMiddleware);
// Runtime.instance.register(JwtMiddleware, {
//     key: 'e98256815795d097dc84594fe5bcf6c55d90d11f04b25e814c7a4bff90667bfb',
//     complete: true,
//     errorHandler: (err, reply) => {
//         reply.log.error(err);
//         reply.status(401).send({ unauthorized: 'you' });
//     },
// } as JwtOptions);
Runtime.instance.register(require('@fastify/multipart'))
Runtime.instance.register(require('@fastify/formbody'))
Runtime.instance.register(cors, { origin: ['http://localhost:3008','http://localhost:3000','http://localhost:3006' ]})

new TicketRouter(
    Runtime,
    new TicketHandler(
        new TicketService(new TicketRepository(new TicketPgStorageProvider()))
    ))

new RatingRouter(
    Runtime,
    new RatingHandler(
        new RatingService(new RatingRepository(new RatingPgStorageProvider()))
    ))

new AttachmentRouter(
    Runtime,
    new AttachmentHandler(
        new AttachmentService(new AttachmentRepository(new AttachmentPgStorageProvider()))
    ))

new MessageRouter(
    Runtime,
    new MessageHandler(
        new MessageService(new MessageRepository(new MessagePgStorageProvider()))
    )
);

Runtime.instance.listen({ port: port as number }, (err) => {
    if (err) throw err;
});