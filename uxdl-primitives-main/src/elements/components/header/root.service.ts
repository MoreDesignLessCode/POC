import { classesToString, debug } from '~/helpers';

class RootService {
  public getClasses(variant: string, sticky: boolean, className: string) {
    const base = classesToString([
      'uxdl-header__root',
      [variant, `uxdl-header__root--${variant}`],
      [sticky, 'uxdl-header__root--sticky'],
      className || ''
    ]);

    debug(`RootService getClasses: base: ${base}`);
    return { base };
  }
}

export const rootService = new RootService();
