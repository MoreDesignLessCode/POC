import { FastifyHttpProvider, IHandler } from '@procter-gamble/apip-api-types';

export class UrlRouter {
    constructor(runtime: FastifyHttpProvider, urlHandler: IHandler) {
        runtime.instance.get('/urls', urlHandler.get);

        runtime.instance.post('/urls', urlHandler.post);

        runtime.instance.post('/urls/compact', urlHandler.post);
        
        runtime.instance.post('/urls/compress', urlHandler.post);

        runtime.instance.get('/urls/:id', urlHandler.get);

        runtime.instance.put('/urls/:id', urlHandler.put);

        runtime.instance.patch('/urls/:id', urlHandler.put);

        runtime.instance.delete('/urls/:id', urlHandler.delete);
    }
}
