[chonky](../README.md) › [Globals](../globals.md) › ["util/file-icon-helper"](_util_file_icon_helper_.md)

# Module: "util/file-icon-helper"

## Index

### Variables

* [AudioExtensions](_util_file_icon_helper_.md#const-audioextensions)
* [ColorsDark](_util_file_icon_helper_.md#const-colorsdark)
* [ColorsLight](_util_file_icon_helper_.md#const-colorslight)
* [ImageExtensions](_util_file_icon_helper_.md#const-imageextensions)
* [VideoExtensions](_util_file_icon_helper_.md#const-videoextensions)
* [getIconTrie](_util_file_icon_helper_.md#const-geticontrie)

### Functions

* [useIconData](_util_file_icon_helper_.md#const-useicondata)

## Variables

### `Const` AudioExtensions

• **AudioExtensions**: *string[]* = [
    '3gpp',
    'aac',
    'adp',
    'aif',
    'aifc',
    'aiff',
    'au',
    'caf',
    'dra',
    'dts',
    'dtshd',
    'ecelp4800',
    'ecelp7470',
    'ecelp9600',
    'eol',
    'flac',
    'kar',
    'lvp',
    'm2a',
    'm3a',
    'm3u',
    'm4a',
    'm4a',
    'mid',
    'midi',
    'mka',
    'mp2',
    'mp2a',
    'mp3',
    'mp3',
    'mp4a',
    'mpga',
    'oga',
    'ogg',
    'pya',
    'ra',
    'ra',
    'ram',
    'rip',
    'rmi',
    'rmp',
    's3m',
    'sil',
    'snd',
    'spx',
    'uva',
    'uvva',
    'wav',
    'wav',
    'wav',
    'wax',
    'weba',
    'wma',
    'xm',
]

*Defined in [src/util/file-icon-helper.ts:270](https://github.com/TimboKZ/Chonky/blob/cb533b8/src/util/file-icon-helper.ts#L270)*

___

### `Const` ColorsDark

• **ColorsDark**: *string[]* = [
    '#777',
    '#8f3d3d',
    '#8f443d',
    '#8f4b3d',
    '#8f523d',
    '#8f583d',
    '#8f5f3d',
    '#8f663d',
    '#8f6d3d',
    '#8f743d',
    '#8f7a3d',
    '#8f813d',
    '#8f883d',
    '#8f8f3d',
    '#888f3d',
    '#818f3d',
    '#7a8f3d',
    '#748f3d',
    '#6d8f3d',
    '#668f3d',
    '#5f8f3d',
    '#588f3d',
    '#528f3d',
    '#4b8f3d',
    '#448f3d',
    '#3d8f3d',
    '#3d8f44',
    '#3d8f4b',
    '#3d8f52',
    '#3d8f58',
    '#3d8f5f',
    '#3d8f66',
    '#3d8f6d',
    '#3d8f74',
    '#3d8f7a',
    '#3d8f81',
    '#3d8f88',
    '#3d8f8f',
    '#3d888f',
    '#3d818f',
    '#3d7a8f',
    '#3d748f',
    '#3d6d8f',
    '#3d668f',
    '#3d5f8f',
    '#3d588f',
    '#3d528f',
    '#3d4b8f',
    '#3d448f',
    '#3d3d8f',
    '#443d8f',
    '#4b3d8f',
    '#523d8f',
    '#583d8f',
    '#5f3d8f',
    '#663d8f',
    '#6d3d8f',
    '#743d8f',
    '#7a3d8f',
    '#813d8f',
    '#883d8f',
    '#8f3d8f',
    '#8f3d88',
    '#8f3d81',
    '#8f3d7a',
    '#8f3d74',
    '#8f3d6d',
    '#8f3d66',
    '#8f3d5f',
    '#8f3d58',
    '#8f3d52',
    '#8f3d4b',
    '#8f3d44',
]

*Defined in [src/util/file-icon-helper.ts:401](https://github.com/TimboKZ/Chonky/blob/cb533b8/src/util/file-icon-helper.ts#L401)*

___

### `Const` ColorsLight

• **ColorsLight**: *string[]* = [
    '#bbbbbb',
    '#d65c5c',
    '#d6665c',
    '#d6705c',
    '#d67a5c',
    '#d6855c',
    '#d68f5c',
    '#d6995c',
    '#d6a35c',
    '#d6ad5c',
    '#d6b85c',
    '#d6c25c',
    '#d6cc5c',
    '#d6d65c',
    '#ccd65c',
    '#c2d65c',
    '#b8d65c',
    '#add65c',
    '#a3d65c',
    '#99d65c',
    '#8fd65c',
    '#85d65c',
    '#7ad65c',
    '#70d65c',
    '#66d65c',
    '#5cd65c',
    '#5cd666',
    '#5cd670',
    '#5cd67a',
    '#5cd685',
    '#5cd68f',
    '#5cd699',
    '#5cd6a3',
    '#5cd6ad',
    '#5cd6b8',
    '#5cd6c2',
    '#5cd6cc',
    '#5cd6d6',
    '#5cccd6',
    '#5cc2d6',
    '#5cb8d6',
    '#5cadd6',
    '#5ca3d6',
    '#5c99d6',
    '#5c8fd6',
    '#5c85d6',
    '#5c7ad6',
    '#5c70d6',
    '#5c66d6',
    '#5c5cd6',
    '#665cd6',
    '#705cd6',
    '#7a5cd6',
    '#855cd6',
    '#8f5cd6',
    '#995cd6',
    '#a35cd6',
    '#ad5cd6',
    '#b85cd6',
    '#c25cd6',
    '#cc5cd6',
    '#d65cd6',
    '#d65ccc',
    '#d65cc2',
    '#d65cb8',
    '#d65cad',
    '#d65ca3',
    '#d65c99',
    '#d65c8f',
    '#d65c85',
    '#d65c7a',
    '#d65c70',
    '#d65c66',
]

*Defined in [src/util/file-icon-helper.ts:326](https://github.com/TimboKZ/Chonky/blob/cb533b8/src/util/file-icon-helper.ts#L326)*

___

### `Const` ImageExtensions

• **ImageExtensions**: *string[]* = [
    '3ds',
    'apng',
    'azv',
    'bmp',
    'bmp',
    'btif',
    'cgm',
    'cmx',
    'djv',
    'djvu',
    'drle',
    'dwg',
    'dxf',
    'emf',
    'exr',
    'fbs',
    'fh',
    'fh4',
    'fh5',
    'fh7',
    'fhc',
    'fits',
    'fpx',
    'fst',
    'g3',
    'gif',
    'heic',
    'heics',
    'heif',
    'heifs',
    'ico',
    'ico',
    'ief',
    'jls',
    'jng',
    'jp2',
    'jpe',
    'jpeg',
    'jpf',
    'jpg',
    'jpg2',
    'jpm',
    'jpx',
    'jxr',
    'ktx',
    'mdi',
    'mmr',
    'npx',
    'pbm',
    'pct',
    'pcx',
    'pcx',
    'pgm',
    'pic',
    'png',
    'pnm',
    'ppm',
    'psd',
    'pti',
    'ras',
    'rgb',
    'rlc',
    'sgi',
    'sid',
    'sub',
    'svg',
    'svgz',
    't38',
    'tap',
    'tfx',
    'tga',
    'tif',
    'tiff',
    'uvg',
    'uvi',
    'uvvg',
    'uvvi',
    'vtf',
    'wbmp',
    'wdp',
    'webp',
    'wmf',
    'xbm',
    'xif',
    'xpm',
    'xwd',
]

*Defined in [src/util/file-icon-helper.ts:182](https://github.com/TimboKZ/Chonky/blob/cb533b8/src/util/file-icon-helper.ts#L182)*

___

### `Const` VideoExtensions

• **VideoExtensions**: *string[]* = [
    '3g2',
    '3gp',
    '3gpp',
    'asf',
    'asx',
    'avi',
    'dvb',
    'f4v',
    'fli',
    'flv',
    'fvt',
    'h261',
    'h263',
    'h264',
    'jpgm',
    'jpgv',
    'jpm',
    'm1v',
    'm2v',
    'm4u',
    'm4v',
    'mj2',
    'mjp2',
    'mk3d',
    'mks',
    'mkv',
    'mng',
    'mov',
    'movie',
    'mp4',
    'mp4v',
    'mpe',
    'mpeg',
    'mpg',
    'mpg4',
    'mxu',
    'ogv',
    'pyv',
    'qt',
    'smv',
    'ts',
    'uvh',
    'uvm',
    'uvp',
    'uvs',
    'uvu',
    'uvv',
    'uvvh',
    'uvvm',
    'uvvp',
    'uvvs',
    'uvvu',
    'uvvv',
    'viv',
    'vob',
    'webm',
    'wm',
    'wmv',
    'wmx',
    'wvx',
]

*Defined in [src/util/file-icon-helper.ts:120](https://github.com/TimboKZ/Chonky/blob/cb533b8/src/util/file-icon-helper.ts#L120)*

___

### `Const` getIconTrie

• **getIconTrie**: *(Anonymous function) & Memoized‹(Anonymous function)›* = memoize(() => {
    let colourIndex = 0;
    const step = 5;

    const IconsToExtensions = [
        // Generic file types
        [ChonkyIconName.license, ['license']],
        [ChonkyIconName.config, ['sfk', 'ini', 'yml', 'toml', 'iml']],
        [ChonkyIconName.model, ['3ds', 'obj', 'ply', 'fbx']],
        [
            ChonkyIconName.database,
            [
                'csv',
                'json',
                'sql',
                'sqlite',
                'sqlite3',
                'npy',
                'npz',
                'rec',
                'idx',
                'hdf5',
            ],
        ],
        [ChonkyIconName.text, ['txt', 'md']],
        [ChonkyIconName.archive, ['zip', 'rar', 'tar', 'tar.gz']],
        [ChonkyIconName.image, ImageExtensions],
        [ChonkyIconName.video, VideoExtensions],
        [
            ChonkyIconName.code,
            [
                'html',
                'php',
                'css',
                'sass',
                'scss',
                'less',
                'cpp',
                'h',
                'hpp',
                'c',
                'xml',
            ],
        ],
        [ChonkyIconName.info, ['bib', 'readme', 'nfo']],
        [ChonkyIconName.key, ['pem', 'pub']],
        [ChonkyIconName.lock, ['lock', 'lock.json', 'shrinkwrap.json']],
        [ChonkyIconName.music, AudioExtensions],
        [ChonkyIconName.terminal, ['run', 'sh']],
        [ChonkyIconName.trash, ['.Trashes']],
        [ChonkyIconName.users, ['authors', 'contributors']],

        // OS file types
        [ChonkyIconName.linux, ['AppImage']],
        [ChonkyIconName.ubuntu, ['deb']],
        [ChonkyIconName.windows, ['exe']],

        // Programming language file types
        [ChonkyIconName.rust, ['rs', 'rlib']],
        [ChonkyIconName.python, ['py', 'ipynb']],
        [ChonkyIconName.nodejs, ['js', 'jsx', 'ts', 'tsx', 'd.ts']],
        [ChonkyIconName.php, ['php']],

        // Development tools file types
        [ChonkyIconName.git, ['.gitignore']],

        // Brands file types
        [ChonkyIconName.adobe, ['psd']],

        // Other program file types
        [ChonkyIconName.pdf, ['pdf']],
        [ChonkyIconName.excel, ['xls', 'xlsx']],
        [ChonkyIconName.word, ['doc', 'docx', 'odt']],
        [ChonkyIconName.flash, ['swf']],
    ] as const;

    const exactTrie = new ExactTrie({ ignoreCase: true });
    for (const pair of IconsToExtensions) {
        const [icon, extensions] = pair;

        for (let i = 0; i < extensions.length; ++i) {
            colourIndex += step;
            const colorCode = (colourIndex % (ColorsLight.length - 1)) + 1;
            const iconData: FileIconData = {
                icon,
                colorCode,
            };
            exactTrie.put(extensions[i], iconData, true);
        }
    }

    return exactTrie;
})

*Defined in [src/util/file-icon-helper.ts:15](https://github.com/TimboKZ/Chonky/blob/cb533b8/src/util/file-icon-helper.ts#L15)*

## Functions

### `Const` useIconData

▸ **useIconData**(`file`: Nullable‹[FileData](../interfaces/_types_files_types_.filedata.md)›): *[FileIconData](../interfaces/_types_icons_types_.fileicondata.md)*

*Defined in [src/util/file-icon-helper.ts:109](https://github.com/TimboKZ/Chonky/blob/cb533b8/src/util/file-icon-helper.ts#L109)*

**Parameters:**

Name | Type |
------ | ------ |
`file` | Nullable‹[FileData](../interfaces/_types_files_types_.filedata.md)› |

**Returns:** *[FileIconData](../interfaces/_types_icons_types_.fileicondata.md)*
