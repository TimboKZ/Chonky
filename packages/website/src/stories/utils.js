import Button from '@material-ui/core/Button';
import { ChonkyActions, ChonkyFileActionData } from 'chonky';
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/relax.css';
import React, { ReactElement, useMemo } from 'react';
import './override.css';

// We ignore some actions to avoid creating noise
const ignoredActions = new Set([
ChonkyActions.MouseClickFile.id,
ChonkyActions.KeyboardClickFile.id,
ChonkyActions.StartDragNDrop.id,
ChonkyActions.EndDragNDrop.id,
ChonkyActions.ChangeSelection.id,
]);

export const showActionNotification = (data) => {
    if (ignoredActions.has(data.action.id)) return;

    const textParts = [];
    textParts.push(
        `<div class="noty-action">Action: <code>${data.action.id}</code></div>`
    );

    if (data.id === ChonkyActions.OpenFiles.id) {
        const fileNames = data.payload.files.map((f) => `<code>${f.name}</code>`);
        if (fileNames.length === 1) {
            textParts.push('You opened a single file:');
        } else {
            textParts.push(`You opened ${fileNames.length} files:`);
        }
        textParts.push(...fileNames);
    }

    if (data.id === ChonkyActions.MoveFiles.id) {
        const fileCount = data.payload.files.length;
        const countString = `${fileCount} file${fileCount !== 1 ? 's' : ''}`;
        const source = `<code>${data.payload.source?.name ?? '~'}</code>`;
        const destination = `<code>${data.payload.destination.name}</code>`;
        textParts.push(`You moved ${countString} from ${source} to ${destination}.`);
    }

    if (data.id === ChonkyActions.DeleteFiles.id) {
        const fileCount = data.state.selectedFilesForAction.length;
        const countString = `${fileCount} file${fileCount !== 1 ? 's' : ''}`;
        textParts.push(`You deleted ${countString} files.`);
    }

    const text = textParts[0] + textParts.slice(1).join('<br/>');

    new Noty({
        text,
        type: 'success',
        theme: 'relax',
        timeout: 3000,
    }).show();
};

const GIT_BRANCH = 'master';
export const useStoryLinks = (links) => {
    return useMemo(
        () => {
            const components = [];
            for (let i = 0; i < links.length; ++i) {
                const link = links[i];
                let name = link.name;
                let href = link.url;
                if (link.docsUrl) {
                    href = link.docsUrl;
                    if (!name) name = 'Relevant docs';
                } else if (link.gitPath) {
                    href = getGitHubLink(link.gitPath);
                    if (!name) name = 'Story source code';
                } else if (!href) {
                    throw new Error(`Link "${link.name}" has no URL specified!`);
                }

                components.push(
                    <Button
                        href={href}
                        color="primary"
                        target="_blank"
                        variant="contained"
                        key={`story-link-${i}`}
                        rel="noreferrer noopener"
                        style={{
                            marginRight: 15,
                            marginBottom: 15,
                            textTransform: 'none',
                        }}
                    >
                        {name}
                    </Button>
                );
            }
            return components;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
        // We deliberately leave hook deps empty as we don't exepct links to change.
    );
};
export const getGitHubLink = (filePath) =>
    `https://github.com/TimboKZ/chonky-website/blob/${GIT_BRANCH}/${filePath}`;
