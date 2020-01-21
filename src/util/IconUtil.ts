/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import { Nullable } from 'tsdef';
import ExactTrie from 'exact-trie';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { icons as defaultIcons } from '../components/Icon';

import { isNil, isObject, isString } from './Util';
import {
  IconData,
  ColorsLight,
  VideoExtensions,
  ImageExtensions,
  AudioExtensions,
  FileData,
} from '../typedef';
import memoize from 'memoizee';

const generateIcons = memoize((icons: typeof defaultIcons) => {
  let colourIndex = 0;
  const step = 5;

  const IconsToExtensions = [
    [icons.license, ['license']],
    [icons.config, ['sfk', 'ini', 'toml', 'iml']],
    [icons.model, ['3ds', 'obj', 'ply', 'fbx']],
    [icons.database, ['json', 'sql']],
    [icons.text, ['txt', 'md']],
    [icons.archive, ['zip', 'rar', 'tar', 'tar.gz']],
    [icons.csv, ['csv', 'xls', 'xlsx']],
    [icons.image, ImageExtensions],
    [icons.pdf, ['pdf']],
    [icons.word, ['doc', 'docx', 'odt']],
    [icons.video, VideoExtensions],
    [
      icons.code,
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
        'ipynb',
      ],
    ],
    [icons.info, ['bib', 'readme', 'nfo']],
    [icons.key, ['pem', 'pub']],
    [icons.lock, ['lock', 'lock.json', 'shrinkwrap.json']],
    [icons.music, AudioExtensions],
    [icons.flash, ['swf']],
    [icons.terminal, ['run', 'sh']],
    [icons.trash, ['.Trashes']],
    [icons.authors, ['authors', 'contributors']],

    [icons.adobe, ['psd']],
    [icons.git, ['.gitignore']],
    [icons.linux, ['AppImage']],
    [icons.nodejs, ['js', 'jsx', 'ts', 'tsx', 'd.ts']],
    [icons.php, ['php']],
    [icons.python, ['py']],
    [icons.ubuntu, ['deb']],
  ];

  const exactTrie = new ExactTrie();
  for (const pair of IconsToExtensions) {
    const [icon, exts] = pair as [IconProp, string[]];

    for (let i = 0; i < exts.length; ++i) {
      colourIndex += step;
      const colorCode = (colourIndex % (ColorsLight.length - 1)) + 1;
      exactTrie.put(exts[i], { icon, colorCode }, true);
    }
  }

  return exactTrie;
});

export const getIconData = (
  file: Nullable<FileData>,
  icons: typeof defaultIcons
): IconData => {
  if (!isObject(file)) return { icon: icons.loading, colorCode: 0 };
  if (file.isDir === true) return { icon: icons.folder, colorCode: 0 };

  const iconMap = generateIcons(icons);
  const match = isString(file.name)
    ? iconMap.getWithCheckpoints(file.name, '.', true)
    : null;
  return !isNil(match) ? match : { icon: icons.file, colorCode: 32 };
};
