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
    makeStyles: (theme: ChonkyTheme) => Styles<C>
) => {
    const selectorMapping = {};
    const makeGlobalStyles = (theme: ChonkyTheme) => {
        const localStyles = makeStyles(theme);
        const globalStyles = {};
        const localSelectors = Object.keys(localStyles);
        localSelectors.map((localSelector) => {
            const globalSelector = `chonky-${localSelector}`;
            const jssSelector = `@global .${globalSelector}`;
            globalStyles[jssSelector] = localStyles[localSelector];
            selectorMapping[localSelector] = globalSelector;
        });
        return globalStyles;
    };

    const useStyles = createUseStyles<ChonkyTheme, C>(makeGlobalStyles as any);
    return (...args: any[]) => {
        const styles = useStyles(...args);
        const classes = {};
        Object.keys(selectorMapping).map((localSelector) => {
            classes[localSelector] = selectorMapping[localSelector];
        });
        return { ...classes, ...styles };
    };
};

export const important = <T>(value: T) => [value, '!important'];

export const c = classnames;
