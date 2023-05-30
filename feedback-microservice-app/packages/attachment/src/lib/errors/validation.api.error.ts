//  import { APIError } from '@procter-gamble/apip-api-types';
import { Uuid } from './id';
import { APIError } from './api.error';
import { Constants } from '../models/constants';

export class ValidationAPIError extends APIError {
    constructor(_code: string, ...innerErrors: unknown[]) {
        super(
            _code,
            Uuid(),
            Constants.errors.generalError.TITLE,
            'VALIDATION API ERROR',
            '',
            ...innerErrors
        );

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ValidationAPIError.prototype);
    }
}
