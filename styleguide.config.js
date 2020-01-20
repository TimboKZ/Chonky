const fs = require('fs');
const path = require('path');

const { version } = require('./package.json');
const { theme, styles } = require('./styleguide.styles');
const typeExtractor = require('./docs/util/TypeExtractor');

let exampleCounter = 0;

module.exports = {
  theme,
  styles,
  title: `Chonky ${version}`,

  assetsDir: 'assets',
  styleguideDir: 'public',
  require: [path.join(__dirname, 'styleguide.css')],

  usageMode: 'expand',
  sections: [
    {
      name: '',
      content: 'docs/Readme.md',
    },
    {
      name: 'Documentation',
      sections: [
        { name: 'Introduction', content: 'docs/markdown/1-Introduction.md' },
        {
          name: 'Installation & usage',
          content: 'docs/markdown/2-Installation.md',
        },
        {
          name: 'Passing files to Chonky',
          content: 'docs/markdown/3-Files.md',
        },
        {
          name: 'Specifying current folder',
          content: 'docs/markdown/4-Folder-chain.md',
        },
        {
          name: 'Generating file descriptions',
          content: 'docs/markdown/5-Generating-descriptions.md',
        },
        {
          name: 'Custom component styling',
          content: 'docs/markdown/6-Styling.md',
        },
        { name: 'Custom icons', content: 'docs/markdown/7-Icons.md' },
        {
          name: 'Displaying file thumbnails',
          content: 'docs/markdown/10-Thumbnails.md',
        },
        {
          name: 'Handling file actions',
          content: 'docs/markdown/8-File-actions.md',
        },
        {
          name: 'Managing file selection',
          content: 'docs/markdown/9-Selection.md',
        },
        {
          name: 'Setting file browser options',
          content: 'docs/Not-available.md',
        },
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
      sections: [
        {
          name: 'Virtualization with 10000 files',
          content: 'docs/examples/Virtualization.md',
        },
      ],
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
          href:
            'https://fonts.googleapis.com/css?family=Fira+Code&display=swap',
        },
      ],
    },
  },
  sortProps: props => props,
  propsParser: (filePath, source, resolver, handlers) => {
    const result = require('react-docgen-typescript')
      .withCustomConfig('./tsconfig.json')
      .parse(filePath, source, resolver, handlers);

    return result.map(component => {
      const { props } = component;
      const mappedProps = Object.values(props).reduce((previous, prop) => {
        const { name, type } = prop;
        if (type.name.includes('| undefined')) {
          type.name = type.name.replace('| undefined', '');
          if (!prop.defaultValue) prop.defaultValue = { value: 'null' };
          if (type.name.startsWith('(') && type.name.endsWith(')')) {
            type.name = type.name.slice(1, type.name.length - 2);
          }
        }
        if (prop.defaultValue && prop.defaultValue.value.charAt(0) === '{') {
          let value = prop.defaultValue.value;
          value = value.replace(/(\n)+/g, '&');
          value = value.replace(/(\s)+/g, '|');
          value = value.replace(/:\|/g, ': ');
          value = value.replace(/&\|}/g, '\n}');
          value = value.replace(/&\|/g, '\n  ');
          prop.defaultValue.value = value;
        }

        return { ...previous, [name]: { ...prop } };
      }, {});

      return {
        ...component,
        props: mappedProps,
      };
    });
  },
  updateExample(props, exampleFilePath) {
    const { settings, lang } = props;
    const exampleDir = path.dirname(exampleFilePath);
    if (typeof settings.componentPath === 'string') {
      const filePath = path.resolve(exampleDir, settings.componentPath);
      const compName = `ExampleComp${exampleCounter++}`;
      const props = {
        content: `import ${compName} from '${filePath}';\n;<${compName}/>;`,
        settings,
        lang,
      };
      // Use lower case, since settings are converted to lowercase for some reason...
      props.settings.displaycontent = fs.readFileSync(filePath, 'utf8');
      return props;
    } else if (typeof settings.filePath === 'string') {
      const filePath = path.resolve(exampleDir, settings.filePath);
      const props = {
        content: fs.readFileSync(filePath, 'utf8'),
        settings,
        lang,
      };
      props.settings.static = true;
      return props;
    } else if (typeof settings.typeName === 'string') {
      const content = typeExtractor({
        typeName: settings.typeName,
        offset: settings.offset,
      });
      if (!content.trim())
        throw new Error(`Could not find type ${settings.typeName}!`);
      const props = {
        content,
        settings,
        lang: 'typescript',
      };
      props.settings.static = true;
      return props;
    }
    props.settings.static = settings.live === undefined;
    return props;
  },
};
