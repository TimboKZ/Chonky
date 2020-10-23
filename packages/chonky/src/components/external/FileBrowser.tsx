import React, { ReactNode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider } from 'react-jss';
import { Provider } from 'react-redux';
import shortid from 'shortid';

import { useChonkyStore } from '../../redux/store';
import { FileBrowserHandle, FileBrowserProps } from '../../types/file-browser.types';
import { useStaticValue } from '../../util/hooks-helpers';
import { lightTheme } from '../../util/styles';
import { ChonkyBusinessLogic } from '../internal/ChonkyBusinessLogic';
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

    // ==== Validation of the most important props
    // const {
    //     cleanFiles,
    //     cleanFolderChain,
    //     errorMessages: fileArrayErrors,
    // } = useFileArrayValidation(files, folderChain);
    // const {
    //     cleanFileActions,
    //     errorMessages: fileActionsErrors,
    // } = useFileActionsValidation(
    //     fileActions,
    //     DefaultFileActions,
    //     !disableDefaultFileActions
    // );
    // const validationErrors = [...fileArrayErrors, ...fileActionsErrors];

    // const businessLogicProps: FileBrowserProps = {
    //     ...props,
    //     files: cleanFiles,
    //     folderChain: cleanFolderChain,
    //     fileActions: cleanFileActions,
    // };

    const chonkyComps = (
        <>
            <ChonkyBusinessLogic ref={ref} {...props} />
            <ChonkyPresentationLayer validationErrors={[]}>
                {children}
            </ChonkyPresentationLayer>
        </>
    );

    return (
        <Provider store={store}>
            <ThemeProvider theme={lightTheme}>
                {disableDragAndDropProvider ? (
                    chonkyComps
                ) : (
                    <DndProvider backend={HTML5Backend}>{chonkyComps}</DndProvider>
                )}
            </ThemeProvider>
        </Provider>
    );
});
FileBrowser.displayName = 'FileBrowser';
