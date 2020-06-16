import 'noty/lib/noty.css';
import 'noty/lib/themes/relax.css';
import './storybook.css';

import {
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

// @ts-ignore
import LiveExampleMd from './Live-examples.md';
import { FileAction, FileActionData } from '../src';

export const createDocsObject = (params: { markdown: string }) => {
    const { markdown } = params;

    return {
        page: () => {
            return (
                <React.Fragment>
                    <DndProvider backend={HTML5Backend}>
                        <Title />
                        {parseMarkdown(markdown)}
                        <CustomPrimary />
                        {parseMarkdown(LiveExampleMd)}
                    </DndProvider>
                </React.Fragment>
            );
        },
    };
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
    const occurrences = [];
    for (const index of indices) {
        const lineEnd = markdown.indexOf('\n', index);
        const line = markdown.substring(index, lineEnd).trim();

        if (/^```[a-z-]+$/i.exec(line)) {
            occurrences.push({
                type: 'start',
                language: line.substring(3),
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
    const components = [];
    let markdownStart = 0;
    for (let i = 0; i < occurrences.length - 1; ++i) {
        const start = occurrences[i];
        const end = occurrences[i + 1];

        if (start.type !== 'start' || end.type !== 'end') continue;
        else i += 1;

        const mdKey = `md-${i}`;
        const mdSlice = markdown.substring(markdownStart, start.markdownEnd);
        const codeSlice = markdown.substring(start.codeStart!, end.codeEnd);
        const codeKey = `code-${i}`;

        components.push(<Description key={mdKey} markdown={mdSlice} />);
        components.push(
            <Source key={codeKey} language={start.language} code={codeSlice} />
        );
        markdownStart = end.markdownStart!;
    }
    components.push(
        <Description key="markdown-last" markdown={markdown.substring(markdownStart)} />
    );

    return components;
};

const getIndicesOf = (needle: string, haystack: string) => {
    const searchStrLen = needle.length;
    if (searchStrLen == 0) {
        return [];
    }
    let index;
    let startIndex = 0;
    const indices = [];
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

    const textParts = [];
    textParts.push(`<b>Action:</b> ${action.name}`);
    if (data.target) {
        textParts.push(`<b>Target:</b> <code>${data.target.name}</code>`);
    }
    if (data.files) {
        const fileNames = data.files.map((f) => f.name);
        const filComps = fileNames.map(name => `<code>${name}</code>`)
        textParts.push(`<b>Files:</b> [${filComps.join(', ')}]`);
    }
    const text = textParts.join('<br/>');

    new Noty({
        text,
        type: 'success',
        theme: 'relax',
        timeout: 3000,
    }).show();
};
