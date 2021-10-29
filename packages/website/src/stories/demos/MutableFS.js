import React, { useCallback, useState, useEffect } from 'react';

import { fileMap, defineFileAction, ChonkyIconName, FullFileBrowser, setChonkyDefaults, ChonkyActions, CustomVisibilityState } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import styled from 'styled-components';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';

import DemoFsMap from './demo.fs_map.json';

setChonkyDefaults({ iconComponent: ChonkyIconFA });

const StyledWrapper = styled.div`
    .chonky-wrapper {
        max-width: 960px;
        height: 400px;
    }
    .story-controls {
        display: inline-block;
        margin-top: 10px;
        padding: 10px;
    }
`;

const StoryComponent = () => {
    // Story controls
    const [storySettings, setStorySettings] = useState({
        dnd: true,
        darkMode: false,
        selection: true,
    });
    const [copyPaste, setCopyPaste] = useState(false);
    const [hideShow, setHideShow] = useState(false);
    const [activate, setActivate] = useState(false);
    const handleSettingChange = useCallback(
        event => setStorySettings(currentState => ({ ...currentState, [event.target.name]: event.target.checked })),
        []
    );

    // Chonky state
    const { data, methods, fileActionHandler } = fileMap.useFileMap({
        baseFileMap: DemoFsMap.fileMap,
        initialFolderId: DemoFsMap.rootFolderId,
    });
    const thumbnailGenerator = useCallback(
        file => (file.thumbnailUrl ? `http://localhost:3000/img/${file.thumbnailUrl}` : null),
        []
    );

    useEffect( () => {
        console.log('copyPaste changed to: ', copyPaste);
        console.log('hideShow changed to: ', hideShow);
        console.log('activate changed to: ', activate);
    }, [copyPaste, hideShow, activate]);

    const customActionHandler = useCallback(
        data => {
            console.log(`File action [${data.id}]`, data);
            switch(data.id) {
                case CopyFiles.id: {
                    setCopyPaste(true);
                    break;
                }
                case PasteFiles.id: {
                    setCopyPaste(false);
                    break;
                }
                case ActivateOptions.id: {
                    setActivate(activate => !activate);
                    break;
                }
                case HiddenOptions.id: {
                    setHideShow(true);
                    break;
                }
                case ShowOptions.id: {
                    setHideShow(false);
                    break;
                }
            }
            fileActionHandler(data);
        },
        [fileActionHandler]
    );

    const PasteFiles = defineFileAction({
        id: 'paste_files',
        requiresSelection: false,
        button: {
            name: 'Paste selection',
            toolbar: true,
            contextMenu: true,
            group: 'Actions',
            icon: ChonkyIconName.paste
        },
        hotkeys: ['ctrl+v', 'cmd+v'],
        customVisibility: () => {
            return copyPaste ? CustomVisibilityState.Default : CustomVisibilityState.Disabled;
        }
    });

    const CopyFiles = defineFileAction({
        id: 'copy_files',
        requiresSelection: true,
        button: {
            name: 'Copy selection',
            toolbar: true,
            contextMenu: true,
            group: 'Actions',
            icon: ChonkyIconName.copy
        },
        hotkeys: ['ctrl+c', 'cmd+c'],
        customVisibility: () => {
            return copyPaste ? CustomVisibilityState.Disabled : CustomVisibilityState.Default;
        }
    });

    const ActivateOptions = defineFileAction({
        id: 'activate_options',
        requiresSelection: true,
        button: {
            name: 'Activate',
            toolbar: true,
            contextMenu: true,
            group: 'Actions',
            icon: ChonkyIconName.paste
        },
        hotkeys: ['ctrl+t', 'cmd+t'],
        customVisibility: () => {
            return activate ? CustomVisibilityState.Active : CustomVisibilityState.Default;
        }
    });

    const HiddenOptions = defineFileAction({
        id: 'hidden_options',
        requiresSelection: true,
        button: {
            name: 'Hide',
            toolbar: true,
            contextMenu: true,
            group: 'Actions',
            icon: ChonkyIconName.hidden
        },
        hotkeys: ['ctrl+h', 'cmd+h'],
        customVisibility: () => {
            return hideShow ? CustomVisibilityState.Hidden : CustomVisibilityState.Default;
        }
    });

    const ShowOptions = defineFileAction({
        id: 'show_options',
        requiresSelection: true,
        button: {
            name: 'Show',
            toolbar: true,
            contextMenu: true,
            group: 'Actions',
            icon: ChonkyIconName.hidden
        },
        hotkeys: ['ctrl+h', 'cmd+h'],
        customVisibility: () => {
            return hideShow ? CustomVisibilityState.Default : CustomVisibilityState.Hidden;
        }
    });


    return (
        <StyledWrapper>
            <div className="chonky-wrapper">
                <FullFileBrowser
                    folderChain={data.folderChain}
                    files={data.files}
                    onFileAction={customActionHandler}
                    fileActions={[
                        ChonkyActions.OpenFiles,
                        CopyFiles,
                        PasteFiles,
                        ActivateOptions,
                        HiddenOptions,
                        ShowOptions
                    ]}
                    thumbnailGenerator={thumbnailGenerator}
                    darkMode={storySettings.darkMode}
                    disableDragAndDrop={!storySettings.dnd}
                    disableSelection={!storySettings.selection}
                />
            </div>
            <Paper className="story-controls">
                <FormControl component="fieldset">
                    <FormLabel component="legend">File browser settings</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={storySettings.darkMode}
                                    onChange={handleSettingChange}
                                    name="darkMode"
                                />
                            }
                            label="Dark mode"
                        />
                        <FormControlLabel
                            control={<Switch checked={storySettings.dnd} onChange={handleSettingChange} name="dnd" />}
                            label="Drag & drop"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={storySettings.selection}
                                    onChange={handleSettingChange}
                                    name="selection"
                                />
                            }
                            label="File selection"
                        />
                    </FormGroup>
                    <FormHelperText>(these are usually set through props)</FormHelperText>
                </FormControl>
            </Paper>
        </StyledWrapper>
    );
};

StoryComponent.displayName = 'Mutable FS';
export const MutableFS = StoryComponent;
