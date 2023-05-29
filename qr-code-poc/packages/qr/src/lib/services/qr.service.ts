import {
    Uuid,
    IRepository,
    Result,
    IService,
    IContext,
} from '../../../../../dist/packages/api';
import { Qr } from '../models/qr';

export class QrService implements IService<Qr> {
    repository: IRepository<Qr>;

    constructor(repository: IRepository<Qr>) {
        this.repository = repository;
    }

    // The service should only hold business logic, and not worry about shapes of the returns
    getById = (id: Uuid, context: IContext): Promise<Result<Qr>> =>
        this.repository.find(id, context);

    getCollection = (context: IContext): Promise<Result<Qr>> =>
        this.repository.all(context);

    create = (entity: Qr, context: IContext): Promise<Result<Qr>> =>{
        console.log("inside service");
        return this.repository.create(entity, context);
    }

    update = (
        id: Uuid,
        entity: Qr,
        context: IContext
    ): Promise<Result<Qr>> => this.repository.update(id, entity, context);

    delete = (id: Uuid, context: IContext): Promise<Result<Qr>> =>
        this.repository.delete(id, context);
}
