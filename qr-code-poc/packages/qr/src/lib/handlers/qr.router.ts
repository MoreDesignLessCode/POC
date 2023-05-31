// import { FastifyHttpProvider, IHandler } from '@procter-gamble/apip-api-types';
import { FastifyHttpProvider, IHandler } from '@litmus7/apip-api-types';



export class QrRouter {
    constructor(runtime: FastifyHttpProvider, qrHandler: IHandler) {
        runtime.instance.get('/qr', qrHandler.get);

        runtime.instance.post('/qr', qrHandler.post);

        runtime.instance.get('/qr/:id', qrHandler.get);

        runtime.instance.put('/qr/:id', qrHandler.put);

        runtime.instance.patch('/qr/:id', qrHandler.put);

        runtime.instance.delete('/qr/:id', qrHandler.delete);
    }
}
