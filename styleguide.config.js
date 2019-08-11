const fs = require('fs');
const path = require('path');

const {version} = require('./package.json');
const {theme, styles} = require('./styleguide.styles');

let exampleCounter = 0;

module.exports = {
    theme,
    styles,
    title: `Chonky ${version}`,

    assetsDir: 'assets',
    styleguideDir: 'public',

    usageMode: 'expand',
    sortProps: props => props,
    propsParser: require('react-docgen-typescript').withCustomConfig('./styleguide.tsconfig.json').parse,
    sections: [
        {
            name: '',
            content: 'docs/Readme.md',
        },
        {
            name: 'Documentation',
            sections: [
                {name: 'Introduction', content: 'docs/markdown/1-Introduction.md'},
                {name: 'Installation & usage', content: 'docs/markdown/2-Installation.md'},
                {name: 'Passing files to Chonky', content: 'docs/markdown/3-Files.md'},
                {name: 'Specifying current folder', content: 'docs/markdown/4-Folder-chain.md'},
                {name: 'Generating file descriptions', content: 'docs/Not-available.md'},
                {name: 'Custom component styling', content: 'docs/markdown/6-Styling.md'},
                {name: 'Display file thumbnails', content: 'docs/markdown/7-Thumbnails.md'},
                {name: 'Handling file actions', content: 'docs/Not-available.md'},
                {name: 'Managing file selection', content: 'docs/Not-available.md'},
                {name: 'Setting file browser options', content: 'docs/Not-available.md'},
            ],
        },
        {
            name: 'Components',
            components: 'src/components/FileBrowser.tsx',
            exampleMode: 'expand',
            usageMode: 'expand',
        },
        {
            name: 'Advanced examples',
            content: 'docs/Not-available.md',
        },
    ],
    template: {
        head: {
            links: [
                {
                    rel: 'shortcut icon',
                    type: 'image/png',
                    href: './favicon.png',
                },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css?family=Fira+Code&display=swap',
                },
            ],
        },
    },
    updateExample(props, exampleFilePath) {
        const {settings, lang} = props;
        if (typeof settings.componentPath === 'string') {
            const filePath = path.resolve(path.dirname(exampleFilePath), settings.componentPath);
            const compName = `ExampleComp${exampleCounter++}`;
            const props = {
                content: `import ${compName} from '${filePath}';\n;<${compName}/>;`,
                settings,
                lang,
            };
            // Use lower case, since settings are converted to lowercase for some reason...
            props.settings.displaycontent = fs.readFileSync(filePath, 'utf8');
            return props;

        } else {
            if (!props.live) props.settings.static = true;
        }
        return props;
    },
};
