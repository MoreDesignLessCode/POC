import {
    Uuid,
    Result,
    IRepository,
    IStorageProvider,
    IContext,
} from '@procter-gamble/apip-api-types';
import { StorageProviderUndefinedError } from '../errors';
import { Constants } from '../models';
import { Url } from '../models/url';

export class UrlRepository implements IRepository<Url> {
    storage: IStorageProvider<Url>;

    constructor(storageProvider: IStorageProvider<Url> | undefined) {
        if (!storageProvider) {
            throw new StorageProviderUndefinedError(
                Constants.errors.repo.url.storageProvider.undefined.CODE
            )
                .withTitle(
                    Constants.errors.repo.url.storageProvider.undefined.TITLE
                )
                .withReason(
                    Constants.errors.repo.url.storageProvider.undefined
                        .MESSAGE
                )
                .toJson();
        }
        this.storage = storageProvider;
    }

    update = (
        id: Uuid,
        resource: Url,
        context: IContext
    ): Promise<Result<Url>> => this.storage.save(id, resource, context);

    delete = (id: Uuid, context: IContext): Promise<Result<Url>> =>
        this.storage.delete(id, context);

    all = (context: IContext): Promise<Result<Url>> =>
        this.storage.all(context);

    find = (id: Uuid, context: IContext): Promise<Result<Url>> =>
        this.storage.findById(id, context);

    create = (resource: Url, context: IContext): Promise<Result<Url>> =>
        this.storage.create(resource, context);

}
