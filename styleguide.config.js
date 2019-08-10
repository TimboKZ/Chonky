const fs = require('fs');
const path = require('path');

const {theme, styles} = require('./styleguide.styles');

module.exports = {
    theme,
    styles,

    assetsDir: 'assets',
    propsParser: require('react-docgen-typescript').withCustomConfig('./styleguide.tsconfig.json').parse,
    sections: [
        {
            name: '',
            content: 'docs/Readme.md',
        },
        {
            name: 'Documentation',
            sections: [
                {name: 'Introduction', content: 'docs/documentation/1-Introduction.md'},
                {name: 'Installation & usage', content: 'docs/documentation/2-Installation.md'},
            ],
        },
        {
            name: 'Components',
            components: 'src/components/FileBrowser.tsx',
            exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
            usageMode: 'expand', // 'hide' | 'collapse' | 'expand'
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
        if (typeof settings.file === 'string') {
            const filepath = path.resolve(path.dirname(exampleFilePath), settings.file);
            return {
                content: fs.readFileSync(filepath, 'utf8'),
                settings,
                lang,
            };
        }
        return props;
    },
};
