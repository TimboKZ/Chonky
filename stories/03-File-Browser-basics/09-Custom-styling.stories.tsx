import 'chonky/style/main.css';

import { createDocsObject, StoryCategories } from '../story-helpers';
// @ts-ignore
// eslint-disable-next-line
import markdown from './09-Custom-styling.md';

const category = StoryCategories.FileBrowserBasics;
const title = 'Custom styling';

// eslint-disable-next-line import/no-default-export
export default {
    title: `${category}/${title}`,
    parameters: {
        docs: createDocsObject({ category, title, markdown, hideStory: true }),
    },
};

export const CustomStyling = () => null;
