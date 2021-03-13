import chonkyPackage from 'chonky/package.json';
import { create } from '@storybook/theming/create';

export default create({
    base: 'light',
    brandTitle: `Chonky v${chonkyPackage.version} Storybook`,
    brandUrl: 'https://chonky.io/',
    brandImage: 'https://chonky.io/chonky-logo-v2.png',
});
