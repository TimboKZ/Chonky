const path = require('path');
const TypeDoc = require('typedoc');

const scriptDir = path.resolve(__dirname);
const chonkyPath = path.resolve(
    scriptDir,
    '..',
    '..',
    '..',
    'Chonky',
    'packages',
    'chonky'
);
const chonkyTsconfigPath = path.resolve(chonkyPath, 'tsconfig.build.json');
const chonkySrcPath = path.resolve(chonkyPath, 'src');
const typedocJsonPath = path.resolve(scriptDir, '..', 'src', 'typedoc.json');

const app = new TypeDoc.Application();

// If you want TypeDoc to load tsconfig.json / typedoc.json files
app.options.addReader(new TypeDoc.TSConfigReader());
app.options.addReader(new TypeDoc.TypeDocReader());

app.bootstrap({
    mode: 'file',
    tsconfig: chonkyTsconfigPath,
});

console.log(`Using Chonky src path: ${chonkySrcPath}`);
const project = app.convert(app.expandInputFiles([chonkySrcPath]));

if (project) {
    app.generateJson(project, typedocJsonPath);
    console.log(`Wrote typedoc JSON to: ${typedocJsonPath}`);
} else {
    console.error('Could not convert project!');
}
