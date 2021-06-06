import React, { useCallback, useState } from 'react';

import { fileMap, FullFileBrowser, setChonkyDefaults } from 'chonky';
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
    const customActionHandler = useCallback(
        data => {
            console.log(`File action [${data.id}]`, data);
            fileActionHandler(data);
        },
        [fileActionHandler]
    );

    return (
        <StyledWrapper>
            <div className="chonky-wrapper">
                <FullFileBrowser
                    folderChain={data.folderChain}
                    files={data.files}
                    onFileAction={customActionHandler}
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
