import merge from 'deepmerge';
import React, { ReactNode, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider } from 'react-jss';
import { Provider } from 'react-redux';
import shortid from 'shortid';

import { useChonkyStore } from '../../redux/store';
import { FileBrowserHandle, FileBrowserProps } from '../../types/file-browser.types';
import { useStaticValue } from '../../util/hooks-helpers';
import { ChonkyIconContext } from '../../util/icon-helper';
import {
    lightTheme,
    mobileOverrideTheme,
    useIsMobileBreakpoint,
} from '../../util/styles';
import { ChonkyBusinessLogic } from '../internal/ChonkyBusinessLogic';
import { ChonkyIconPlaceholder } from '../internal/ChonkyIconPlaceholder';
import { ChonkyPresentationLayer } from '../internal/ChonkyPresentationLayer';

// if (process.env.NODE_ENV === 'development') {
//     const whyDidYouRender = require('@welldone-software/why-did-you-render');
//     whyDidYouRender(React, {
//         trackAllPureComponents: true,
//     });
// }

export const FileBrowser = React.forwardRef<
    FileBrowserHandle,
    FileBrowserProps & { children?: ReactNode }
>((props, ref) => {
    const { instanceId, disableDragAndDropProvider, children } = props;

    const chonkyInstanceId = useStaticValue(() => instanceId ?? shortid.generate());
    const store = useChonkyStore(chonkyInstanceId);

    const isMobileBreakpoint = useIsMobileBreakpoint();
    const theme = useMemo(() => {
        return isMobileBreakpoint ? merge(lightTheme, mobileOverrideTheme) : lightTheme;
    }, [isMobileBreakpoint]);

    const chonkyComps = (
        <>
            <ChonkyBusinessLogic ref={ref} {...props} />
            <ChonkyPresentationLayer>{children}</ChonkyPresentationLayer>
        </>
    );

    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <ChonkyIconContext.Provider value={null ?? ChonkyIconPlaceholder}>
                    {disableDragAndDropProvider ? (
                        chonkyComps
                    ) : (
                        <DndProvider backend={HTML5Backend}>{chonkyComps}</DndProvider>
                    )}
                </ChonkyIconContext.Provider>
            </ThemeProvider>
        </Provider>
    );
});
FileBrowser.displayName = 'FileBrowser';
