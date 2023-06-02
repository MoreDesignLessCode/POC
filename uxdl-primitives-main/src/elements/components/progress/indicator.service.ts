import { classesToString, debug } from '~/helpers';

class IndicatorService {
  public getClasses(variant: string, rounded: string, className: string) {
    const base = classesToString([
      'uxdl-progress__indicator',
      [variant, `uxdl-progress__indicator--${variant}`],
      [rounded, `uxdl__border-radius--${rounded}`],
      className || ''
    ]);

    debug(`IndicatorService getClasses: base: ${base}`);
    return { base };
  }
}

export const indicatorService = new IndicatorService();
