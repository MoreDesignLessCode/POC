import { classesToString, debug } from '~/helpers';

class RootService {
  public getClasses(rounded: string, className: string) {
    const base = classesToString(['uxdl-card__root', [rounded, `uxdl__border-radius--${rounded}`], className || '']);

    debug(`RootService getClasses: base: ${base}`);
    return { base };
  }
}

export const rootService = new RootService();
