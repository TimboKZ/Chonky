import classnames from 'classnames';
import { Styles } from 'jss';
import { createUseStyles } from 'react-jss';

export const lightTheme = {
    colors: {
        debugRed: '#fabdbd',
        debugBlue: '#bdd8fa',
        debugGreen: '#d2fabd',
        debugPurple: '#d2bdfa',
        debugYellow: '#fae9bd',

        bgPrimary: '#fff',

        textPrimary: '#000',
        textSubtle: '#bbb',
        textActive: '#09f',
    },

    fontSizes: {
        rootPrimary: 15,
    },

    margins: {
        rootLayoutMargin: 8,
    },

    toolbar: {
        size: '30px', // `px` suffix is required for `line-height` fields to work
        fontSize: 15,
        buttonRadius: 4,
    },

    fileList: {
        desktopGridGutter: 8,
        mobileGridGutter: 5,
    },

    rootBorder: 'solid 1px #e4e4e4',
} as const;

export type ChonkyTheme = typeof lightTheme;

export const makeChonkyStyles = <C extends string = string>(
    styles: (theme: ChonkyTheme) => Styles<C>
) => createUseStyles<ChonkyTheme, C>(styles);

export const important = <T>(value: T) => [value, '!important'];

export const c = classnames;
