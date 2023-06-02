import { classesToString, debug } from '~/helpers';

class ButtonService {
  public getClasses(
    variant: string,
    outline: boolean,
    rounded: string,
    intent: string,
    disabled: boolean,
    className: string
  ) {
    const base = classesToString([
      'uxdl-button',
      [variant, `uxdl-button--${variant}`],
      [outline, 'uxdl-button--outline'],
      [rounded, `uxdl__border-radius--${rounded}`],
      [intent, `is-${intent}`],
      [disabled, 'is-disabled'],
      className || ''
    ]);

    debug(`ButtonService getClasses: base: ${base}`);
    return { base };
  }
}

export const buttonService = new ButtonService();
