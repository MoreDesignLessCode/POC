import { create } from '@storybook/theming';

export const Themes = {
  manager: create({
    base: 'light',
    brandTitle: 'UX Design Library',
    brandUrl: 'https://github.com/procter-gamble/uxdl-primitives',
    brandImage: '/docs/resources/logo-text.svg',
    colorSecondary: '#ad99ff',
    fontBase: '"Source Sans Pro", sans-serif'
  }),
  docs: create({
    base: 'light',
    fontBase: '"Source Sans Pro", sans-serif'
  })
};
