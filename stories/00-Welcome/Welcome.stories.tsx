// @ts-ignore
import mdx from './Welcome.mdx';

// eslint-disable-next-line import/no-default-export
export default {
    title: 'Chonky overview',
};

export const Overview = () => null;

Overview.story = {
    name: 'Overview',
    parameters: {
        docs: {
            page: mdx,
        },
        viewMode: 'docs',
    },
};
