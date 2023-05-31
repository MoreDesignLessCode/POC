import {
    Uuid,
    IRepository,
    Result,
    IService,
    IContext,
} from '@litmus7/apip-api-types';
import { Url } from '../models/url';

export class UrlService implements IService<Url> {
    repository: IRepository<Url>;

    constructor(repository: IRepository<Url>) {
        this.repository = repository;
    }

    // The service should only hold business logic, and not worry about shapes of the returns
    getById = (id: Uuid, context: IContext): Promise<Result<Url>> =>
        this.repository.find(id, context);

    getCollection = (context: IContext): Promise<Result<Url>> =>
        this.repository.all(context);

    create = (entity: Url, context: IContext): Promise<Result<Url>> =>
        this.repository.create(entity, context);


    update = (
        id: Uuid,
        entity: Url,
        context: IContext
    ): Promise<Result<Url>> => this.repository.update(id, entity, context);

    delete = (id: Uuid, context: IContext): Promise<Result<Url>> =>
        this.repository.delete(id, context);
}
