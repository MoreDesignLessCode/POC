import { APIError } from '../../errors/api.error';
import { Data } from './Data';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IResource {}

export type Result<T extends IResource> =
  | { type: 'ok'; data: Data<T> }
  | { type: 'error'; data: APIError };
