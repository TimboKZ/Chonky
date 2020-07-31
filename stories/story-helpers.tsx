import 'noty/lib/noty.css';
import 'noty/lib/themes/relax.css';
import './storybook.css';

import {
    Anchor,
    Description,
    DocsContext,
    DocsStory,
    Title,
} from '@storybook/addon-docs/blocks';
import { getDocsStories } from '@storybook/addon-docs/dist/blocks/utils';
import { Source } from '@storybook/components';
import Noty from 'noty';
import React, { useContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { ChonkyActions, FileAction, FileActionData } from '../src';
// @ts-ignore
import LiveExampleMd from './Live-examples.md';
// @ts-ignore
import UnstableWarningMd from './Unstable-warning.md';

export enum StoryCategories {
    Introduction = 'Introduction',
    Demos = 'Demos',
    FileBrowserBasics = 'Basics',
    FileBrowserExamples = 'Examples',
    ApiReference = 'API Reference',
}

export const createDocsObject = (params: {
    category: string;
    title: string;
    markdown: string;
    hideStory?: boolean;
}) => {
    return {
        page: () => {
            return <CustomDocsComponent {...params} />;
        },
    };
};

export const CustomDocsComponent = (props: {
    markdown: string;
    hideStory?: boolean;
}) => {
    const { markdown, hideStory } = props;

    const context = useContext(DocsContext);
    const componentStories = getDocsStories(context);

    const storyId = componentStories.length > 0 ? componentStories[0].id : null;

    return (
        <React.Fragment>
            <DndProvider backend={HTML5Backend}>
                {storyId && <Anchor storyId={storyId} />}
                {parseMarkdown(UnstableWarningMd)}
                <Title />
                {parseMarkdown(markdown)}
                {!hideStory && (
                    <>
                        <CustomPrimary />
                        {parseMarkdown(LiveExampleMd)}
                    </>
                )}
            </DndProvider>
        </React.Fragment>
    );
};

export const CustomPrimary: React.FC<any> = ({ name }) => {
    const context = useContext(DocsContext);
    const componentStories = getDocsStories(context);
    let story;
    if (componentStories) {
        story = name
            ? componentStories.find((s) => s.name === name)
            : componentStories[0];
    }
    return story ? <DocsStory {...story} expanded={false} /> : null;
};

const parseMarkdown = (markdown: string): React.ReactElement[] => {
    // Extract indices of start and end of each code block
    const indices = getIndicesOf('```', markdown);

    // Match indices to start/end location
    const occurrences: any[] = [];
    for (const index of indices) {
        const lineEnd = markdown.indexOf('\n', index);
        const line = markdown.substring(index, lineEnd).trim();

        const opening_matches = /^```([a-z-]+)(\s+{.*?})?$/i.exec(line);

        if (opening_matches) {
            const [, language, jsonConfig] = opening_matches;
            occurrences.push({
                type: 'start',
                language,
                jsonConfig,
                markdownEnd: index,
                codeStart: lineEnd + 1,
            });
        } else if (/^```$/i.exec(line)) {
            occurrences.push({
                type: 'end',
                codeEnd: index,
                markdownStart: lineEnd + 1,
            });
        }
    }

    // Create components based on start/end location
    const components: React.ReactElement[] = [];
    let markdownStart = 0;
    for (let i = 0; i < occurrences.length - 1; ++i) {
        const start = occurrences[i];
        const end = occurrences[i + 1];

        if (start.type !== 'start' || end.type !== 'end') continue;
        else i += 1;

        const mdSlice = markdown.substring(markdownStart, start.markdownEnd);
        const codeSlice = markdown.substring(start.codeStart!, end.codeEnd);

        components.push(prepareMarkdownComp(i, mdSlice));
        components.push(prepareCodeComp(i, start.language, codeSlice));
        markdownStart = end.markdownStart!;
    }
    components.push(
        <Description key="markdown-last" markdown={markdown.substring(markdownStart)} />
    );

    return components;
};

const prepareMarkdownComp = (index: number, markdown: string) => {
    return <Description key={`md-${index}`} markdown={markdown} />;
};

const prepareCodeComp = (index: number, language?: string, code?: string) => {
    const key = `code-${2 * index + 1}`;
    return <Source key={key} language={language} code={code} />;
};

const getIndicesOf = (needle: string, haystack: string) => {
    const searchStrLen = needle.length;
    if (searchStrLen == 0) {
        return [];
    }
    let index;
    let startIndex = 0;
    const indices: number[] = [];
    while ((index = haystack.indexOf(needle, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
};

export const showActionNotification = (params: {
    action: FileAction;
    data: FileActionData;
}) => {
    const { action, data } = params;

    if (action.id === ChonkyActions.ChangeSelection.id) {
        // Don't show notifications for "change_selection" action as it creates too
        // much noise.
        return;
    }

    const textParts: string[] = [];
    textParts.push(`<b>Action:</b> ${action.id}`);
    if (data.target) {
        textParts.push(`<b>Target:</b> <code>${data.target.name}</code>`);
    }
    if (data.files) {
        const fileNames = data.files.map((f) => f.name);
        const fileComps = fileNames.map((name) => `<code>${name}</code>`);
        const fileCount = fileComps.length;
        const fileTitle = `${fileCount} ${fileCount === 1 ? 'file' : 'files'}:`;
        textParts.push(`<b>${fileTitle}</b> [${fileComps.join(', ')}]`);
    }
    const text = textParts.join('<br/>');

    new Noty({
        text,
        type: 'success',
        theme: 'relax',
        timeout: 3000,
    }).show();
};
