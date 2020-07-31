import React, { ReactNode } from 'react';
import { RecoilRoot } from 'recoil';

import { FileBrowserHandle, FileBrowserProps } from '../../types/file-browser.types';
import { DefaultFileActions } from '../../util/file-actions-definitions';
import {
    useFileActionsValidation,
    useFileArrayValidation,
} from '../../util/validation';
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
    const { files, children } = props;

    // ==== Default values assignment
    const folderChain = props.folderChain ? props.folderChain : null;
    const fileActions = props.fileActions ? props.fileActions : [];
    const disableDefaultFileActions = !!props.disableDefaultFileActions;

    // ==== Validation of the most important props
    const {
        cleanFiles,
        cleanFolderChain,
        errorMessages: fileArrayErrors,
    } = useFileArrayValidation(files, folderChain);
    const {
        cleanFileActions,
        errorMessages: fileActionsErrors,
    } = useFileActionsValidation(
        fileActions,
        DefaultFileActions,
        !disableDefaultFileActions
    );
    const validationErrors = [...fileArrayErrors, ...fileActionsErrors];

    const businessLogicProps: FileBrowserProps = {
        ...props,
        files: cleanFiles,
        folderChain: cleanFolderChain,
        fileActions: cleanFileActions,
    };

    return (
        <RecoilRoot>
            <ChonkyBusinessLogic ref={ref} {...businessLogicProps} />
            <ChonkyPresentationLayer validationErrors={validationErrors}>
                {children}
            </ChonkyPresentationLayer>
        </RecoilRoot>
    );
});
