import { FastifyHttpProvider, IHandler } from '@litmus7/apip-api-types';

export class MessageRouter {
    constructor(runtime: FastifyHttpProvider, messageHandler: IHandler) {
        runtime.instance.get('/messages', messageHandler.get);

        runtime.instance.post('/messages', messageHandler.post);

        runtime.instance.get('/messages/:id', messageHandler.get);

       runtime.instance.put('/messages/:id', messageHandler.put);

        runtime.instance.patch('/messages/:id', messageHandler.put);

        runtime.instance.delete('/messages/:id', messageHandler.delete);
    }
}
