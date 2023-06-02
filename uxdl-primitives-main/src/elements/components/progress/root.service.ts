import { classesToString, debug } from '~/helpers';

class RootService {
  public getClasses(className: string) {
    const base = classesToString(['uxdl-progress__root', className || '']);

    debug(`RootService getClasses: base: ${base}`);
    return { base };
  }
}

export const rootService = new RootService();
