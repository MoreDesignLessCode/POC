import { classesToString, debug } from '~/helpers';

class ContentService {
  public getClasses(side: string, className: string) {
    const base = classesToString(['uxdl-tooltip__content', [side, `uxdl-tooltip__content--${side}`], className || '']);

    debug(`ContentService getClasses: base: ${base}`);
    return { base };
  }
}

export const contentService = new ContentService();
