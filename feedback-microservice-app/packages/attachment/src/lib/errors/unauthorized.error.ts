//  import { APIError } from '@procter-gamble/apip-api-types';
import { Uuid } from './id';
import { APIError } from './api.error';
import { Constants } from '../models/constants';

export class UnauthorizedError extends APIError {
    constructor(_code: string, ...innerErrors: unknown[]) {
        super(
            _code,
            Uuid(),
            Constants.errors.authorization.unauthorized.TITLE,
            'UNAUTHORIZED ERROR',
            '',
            ...innerErrors
        );

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}
