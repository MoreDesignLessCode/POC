/* eslint-disable @typescript-eslint/no-empty-interface */
export interface IResource {}

export type Data<T extends IResource> =
  | { type: 'resource'; value: T }
  | { type: 'collection'; value: Array<T> };