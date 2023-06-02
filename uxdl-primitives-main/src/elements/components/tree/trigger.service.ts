import { classesToString, debug } from '~/helpers';

class TriggerService {
  public getClasses(variant: string, className: string) {
    const base = classesToString(['uxdl-tree__trigger', [variant, `uxdl-tree__trigger--${variant}`], className || '']);

    debug(`TriggerService getClasses: base: ${base}`);
    return { base };
  }
}

export const triggerService = new TriggerService();
