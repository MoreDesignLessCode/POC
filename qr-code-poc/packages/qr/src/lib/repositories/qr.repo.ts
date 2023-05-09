import {
    Uuid,
    Result,
    IRepository,
    IStorageProvider,
    IContext,
} from '@procter-gamble/apip-api-types';
import { StorageProviderUndefinedError } from '../errors';
import { Constants } from '../models';
import { Qr } from '../models/qr';

export class QrRepository implements IRepository<Qr> {
    storage: IStorageProvider<Qr>;

    constructor(storageProvider: IStorageProvider<Qr> | undefined) {
        if (!storageProvider) {
            throw new StorageProviderUndefinedError(
                Constants.errors.repo.qr.storageProvider.undefined.CODE
            )
                .withTitle(
                    Constants.errors.repo.qr.storageProvider.undefined.TITLE
                )
                .withReason(
                    Constants.errors.repo.qr.storageProvider.undefined
                        .MESSAGE
                )
                .toJson();
        }
        this.storage = storageProvider;
    }

    update = (
        id: Uuid,
        resource: Qr,
        context: IContext
    ): Promise<Result<Qr>> => this.storage.save(id, resource, context);

    delete = (id: Uuid, context: IContext): Promise<Result<Qr>> =>
        this.storage.delete(id, context);

    all = (context: IContext): Promise<Result<Qr>> =>
        this.storage.all(context);

    find = (id: Uuid, context: IContext): Promise<Result<Qr>> =>
        this.storage.findById(id, context);

    create = (resource: Qr, context: IContext): Promise<Result<Qr>> =>
        this.storage.create(resource, context);
}
