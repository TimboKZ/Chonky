import useMediaQuery from '@material-ui/core/useMediaQuery';
import classnames from 'classnames';
import { Styles } from 'jss';
import { createUseStyles } from 'react-jss';
import { DeepPartial } from 'tsdef';

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
        size: 30,
        lineHeight: '30px', // `px` suffix is required for `line-height` fields to work
        fontSize: 15,
        buttonRadius: 4,
    },

    dnd: {
        canDropColor: 'green',
        cannotDropColor: 'red',
        canDropMask: 'rgba(180, 235, 180, 0.75)',
        cannotDropMask: 'rgba(235, 180, 180, 0.75)',
        fileListMaskOne: 'rgba(180, 235, 180, 0.1)',
        fileListMaskTwo: 'rgba(180, 235, 180, 0.2)',
    },

    dragLayer: {
        boxShadow: '2px 2px 5px #888',
        backgroundColor: '#f5f5f5',
        border: 'solid 2px #09f',
        padding: '7px 10px',
        borderRadius: 2,
    },

    fileList: {
        desktopGridGutter: 8,
        mobileGridGutter: 5,
    },

    gridFileEntry: {
        childrenCountSize: '1.6em',
        iconColorFocused: '#000',
        modifiersColor: '#888',
        iconSize: '2.4em',
        iconColor: '#fff',
        borderRadius: 5,
        fontSize: 14,
    },

    listFileEntry: {
        propertyFontSize: 14,
        iconFontSize: '1.1em',
        iconBorderRadius: 5,
        borderColor: '#eee',
        fontSize: 14,
    },

    rootBorder: 'solid 1px #e4e4e4',
};

export type ChonkyTheme = typeof lightTheme;

export const mobileOverrideTheme: DeepPartial<ChonkyTheme> = {
    fontSizes: {
        rootPrimary: 13,
    },
    margins: {
        rootLayoutMargin: 4,
    },
    toolbar: {
        size: 28,
        lineHeight: '28px',
        fontSize: 13,
    },
    gridFileEntry: {
        fontSize: 13,
    },
    listFileEntry: {
        propertyFontSize: 12,
        iconFontSize: '1em',
        fontSize: 13,
    },
};

export const useIsMobileBreakpoint = () => {
    return useMediaQuery('(max-width:480px)');
};

export const getStripeGradient = (colorOne: string, colorTwo: string) =>
    'repeating-linear-gradient(' +
    '45deg,' +
    `${colorOne},` +
    `${colorOne} 10px,` +
    `${colorTwo} 0,` +
    `${colorTwo} 20px` +
    ')';

export const makeLocalChonkyStyles = <C extends string = string>(
    styles: (theme: ChonkyTheme) => Styles<C>
) => createUseStyles<ChonkyTheme, C>(styles);

export const makeGlobalChonkyStyles = <C extends string = string>(
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
