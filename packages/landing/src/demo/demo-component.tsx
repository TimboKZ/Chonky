import { faSyncAlt } from '@fortawesome/free-solid-svg-icons/faSyncAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
    ChonkyActions,
    FileBrowser,
    FileContextMenu,
    FileData,
    FileList,
    FileNavbar,
    FileToolbar,
    setChonkyDefaults,
} from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import React, { useCallback, useMemo } from 'react';
import { getButtonStyles } from '../components/LinkButton';
import { DemoSource2x, MostRecentStorybook } from '../util/links';
import {
    useCustomFileMap,
    useFileActionHandler,
    useFiles,
    useFolderChain,
} from './demo-hooks';

setChonkyDefaults({ iconComponent: ChonkyIconFA });

export const DemoComponent: React.FC = () => {
    const {
        fileMap,
        currentFolderId,
        setCurrentFolderId,
        resetFileMap,
        deleteFiles,
        moveFiles,
        createFolder,
    } = useCustomFileMap();
    const files = useFiles(fileMap, currentFolderId);
    const folderChain = useFolderChain(fileMap, currentFolderId);
    const handleFileAction = useFileActionHandler(
        setCurrentFolderId,
        deleteFiles,
        moveFiles,
        createFolder
    );
    const fileActions = useMemo(
        () => [ChonkyActions.CreateFolder, ChonkyActions.DeleteFiles],
        []
    );
    const thumbnailGenerator = useCallback(
        (file: FileData) =>
            file.thumbnailUrl ? `https://chonky.io${file.thumbnailUrl}` : null,
        []
    );

    const classes = useStyles({} as any);

    return (
        <>
            <Paper className={classes.demoWrapper} elevation={3}>
                <FileBrowser
                    instanceId={'chonky-demo'}
                    files={files}
                    folderChain={folderChain}
                    fileActions={fileActions}
                    onFileAction={handleFileAction}
                    thumbnailGenerator={thumbnailGenerator}
                >
                    <FileNavbar />
                    <FileToolbar />
                    <FileList />
                    <FileContextMenu />
                </FileBrowser>
            </Paper>
            <div className={classes.buttonContainer}>
                <Button
                    size="small"
                    className={classes.button}
                    onClick={resetFileMap}
                    variant="contained"
                    startIcon={<FontAwesomeIcon icon={faSyncAlt} fixedWidth={true} />}
                >
                    Reset demo
                </Button>
                <Button
                    size="small"
                    className={classes.button}
                    href={DemoSource2x.url}
                    variant="contained"
                    startIcon={
                        <FontAwesomeIcon icon={DemoSource2x.icon} fixedWidth={true} />
                    }
                >
                    View source code
                </Button>
                <Button
                    size="small"
                    className={classes.button}
                    href={MostRecentStorybook.url}
                    variant="contained"
                    startIcon={
                        <FontAwesomeIcon
                            icon={MostRecentStorybook.icon}
                            fixedWidth={true}
                        />
                    }
                >
                    View storybook
                </Button>
            </div>
        </>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        demoWrapper: {
            position: 'relative',
            height: 600,
        },
        buttonContainer: {
            textAlign: 'center',
            padding: 10,
        },
        button: {
            textTransform: 'none',
            fontWeight: 'bold',
            margin: '10px',
            ...getButtonStyles(theme, '#654295'),
        },
    })
);
