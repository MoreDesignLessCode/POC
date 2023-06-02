import { classesToString, debug } from '~/helpers';

class ItemService {
  public getClasses(variant: string, className: string) {
    const base = classesToString(['uxdl-tree__item', [variant, `uxdl-tree__item--${variant}`], className || '']);

    debug(`ItemService getClasses: base: ${base}`);
    return { base };
  }
}

export const itemService = new ItemService();
