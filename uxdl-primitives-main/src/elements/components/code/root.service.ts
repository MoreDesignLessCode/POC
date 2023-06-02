
import { classesToString, debug } from '~/helpers';

class RootService {
  public getClasses(variant: string, className: string) {
    const base = classesToString(['uxdl-code__root', [variant, `uxdl-code__root--${variant}`], className || '']);

    debug(`RootService getClasses: base: ${base}`);
    return { base };
  }
}

export const rootService = new RootService();
