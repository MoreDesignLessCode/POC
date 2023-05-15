import {
    UrlHandler,
    UrlRouter,
    UrlRepository,
    UrlService,
    UrlPgStorageProvider,
 } from '../dist/packages/url';
import {
    QrHandler,
    QrRouter,
    QrRepository,
    QrService,
    QrPgStorageProvider,
} from '../dist/packages/qr';
import cors from '@fastify/cors'

import { FastifyHttpProvider } from '@procter-gamble/apip-api-types';
import { fastifyRequestContextMiddleware } from '@procter-gamble/apip-context-middleware';
import { JwtMiddleware, JwtOptions } from '@procter-gamble/apip-jwt-middleware';
import * as dotenv from 'dotenv';


dotenv.config();

const port = process.env.QRCODE_DAS_PORT || 3000;
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
Runtime.instance.register(cors, { origin: ['http://localhost:3008','http://localhost:3000','http://localhost:3006' ]})
new QrRouter(
    Runtime,
    new QrHandler(
        new QrService(new QrRepository(new QrPgStorageProvider()))
    )
);
new UrlRouter(
    Runtime,
    new UrlHandler(
        new UrlService(new UrlRepository(new UrlPgStorageProvider()))
    )
);
Runtime.instance.listen({ port: port as number }, (err) => {
    if (err) throw err;
});
