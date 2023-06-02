import { classesToString, debug } from '~/helpers';

class ContentService {
  public getClasses(rounded: string, className: string) {
    const base = classesToString(['uxdl-alert__content', [rounded, `uxdl__border-radius--${rounded}`], className || '']);

    debug(`ContentService getClasses: base: ${base}`);
    return { base };
  }
}

export const contentService = new ContentService();
