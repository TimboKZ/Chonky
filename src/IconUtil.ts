/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import {Nullable} from 'tsdef';
import ExactTrie from 'exact-trie';
import {
    faBalanceScale,
    faCircleNotch,
    faCode,
    faCogs,
    faCubes,
    faDatabase,
    faExclamationTriangle,
    faFile,
    faFileAlt,
    faFileArchive,
    faFileCode,
    faFileExcel,
    faFileImage,
    faFilePdf,
    faFileWord,
    faFilm,
    faFolder,
    faInfoCircle,
    faKey,
    faLock,
    faMusic,
    faRunning,
    faTerminal,
    faTrash,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {faAdobe, faGitAlt, faLinux, faNodeJs, faPhp, faPython, faUbuntu} from '@fortawesome/free-brands-svg-icons';

import {IconData, ColorsLight, VideoExtensions, ImageExtensions, AudioExtensions, FileData} from './typedef';

const ErrorIconData: IconData = {icon: faExclamationTriangle, colorCode: 1};
export const LoadingIconData: IconData = {icon: faCircleNotch, colorCode: 0};
const FolderIconData: IconData = {icon: faFolder, colorCode: 0};
const FileIconData: IconData = {icon: faFile, colorCode: 32};
const IconsToExtensions = [
    [faBalanceScale, ['license']],
    [faCode, ['ipynb']],
    [faCogs, ['sfk', 'ini', 'toml', 'iml']],
    [faCubes, ['3ds', 'obj', 'ply', 'fbx']],
    [faDatabase, ['json', 'sql']],
    [faFileAlt, ['txt', 'md', 'nfo']],
    [faFileArchive, ['zip', 'rar', 'tar', 'tar.gz']],
    [faFileExcel, ['csv', 'xls', 'xlsx']],
    [faFileImage, ImageExtensions],
    [faFilePdf, ['pdf']],
    [faFileWord, ['doc', 'docx', 'odt']],
    [faFilm, VideoExtensions],
    [faFileCode, ['html', 'php', 'css', 'sass', 'scss', 'less', 'cpp', 'h', 'hpp', 'c', 'xml']],
    [faInfoCircle, ['bib', 'readme']],
    [faKey, ['pem', 'pub']],
    [faLock, ['lock', 'lock.json', 'shrinkwrap.json']],
    [faMusic, AudioExtensions],
    [faRunning, ['swf']],
    [faTerminal, ['run', 'sh']],
    [faTrash, ['.Trashes']],
    [faUsers, ['authors', 'contributors']],

    [faAdobe, ['psd']],
    [faGitAlt, ['.gitignore']],
    [faLinux, ['AppImage']],
    [faNodeJs, ['js', 'jsx', 'ts', 'tsx', 'd.ts']],
    [faPhp, ['php']],
    [faPython, ['py']],
    [faUbuntu, ['deb']],
];

const step = 5;
let colourIndex = 0;

const exactTrie = new ExactTrie();
for (const pair of IconsToExtensions) {
    const [icon, exts] = pair as [IconProp, string[]];

    for (let i = 0; i < exts.length; ++i) {
        colourIndex += step;
        const colorCode = colourIndex % (ColorsLight.length - 1) + 1;
        exactTrie.put(exts[i], {icon, colorCode}, true);
    }
}

export const getIconData = (file: Nullable<FileData>): IconData => {
    if (!file) return ErrorIconData;
    if (file.isDir) return FolderIconData;

    const match = exactTrie.getWithCheckpoints(file.name, '.', true);
    return match ? match : FileIconData;
};