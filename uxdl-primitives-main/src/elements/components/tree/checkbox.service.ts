import { classesToString, debug } from '~/helpers';

class CheckboxService {
  public getClasses(variant: string, className: string) {
    const base = classesToString([
      'uxdl-tree__checkbox',
      [variant, `uxdl-tree__checkbox--${variant}`],
      className || ''
    ]);

    debug(`CheckboxService getClasses: base: ${base}`);
    return { base };
  }
}

export const checkboxService = new CheckboxService();
