import { faAdobe } from '@fortawesome/free-brands-svg-icons/faAdobe';
import { faGitAlt } from '@fortawesome/free-brands-svg-icons/faGitAlt';
import { faLinux } from '@fortawesome/free-brands-svg-icons/faLinux';
import { faNodeJs } from '@fortawesome/free-brands-svg-icons/faNodeJs';
import { faPhp } from '@fortawesome/free-brands-svg-icons/faPhp';
import { faPython } from '@fortawesome/free-brands-svg-icons/faPython';
import { faUbuntu } from '@fortawesome/free-brands-svg-icons/faUbuntu';
import { faWindows } from '@fortawesome/free-brands-svg-icons/faWindows';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';
import { faBalanceScale } from '@fortawesome/free-solid-svg-icons/faBalanceScale';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';
import { faCogs } from '@fortawesome/free-solid-svg-icons/faCogs';
import { faCubes } from '@fortawesome/free-solid-svg-icons/faCubes';
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase';
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';
import { faFile } from '@fortawesome/free-solid-svg-icons/faFile';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt';
import { faFileArchive } from '@fortawesome/free-solid-svg-icons/faFileArchive';
import { faFileCode } from '@fortawesome/free-solid-svg-icons/faFileCode';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons/faFileExcel';
import { faFileImage } from '@fortawesome/free-solid-svg-icons/faFileImage';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
import { faFileWord } from '@fortawesome/free-solid-svg-icons/faFileWord';
import { faFilm } from '@fortawesome/free-solid-svg-icons/faFilm';
import { faFistRaised } from '@fortawesome/free-solid-svg-icons/faFistRaised';
import { faFolder } from '@fortawesome/free-solid-svg-icons/faFolder';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons/faFolderOpen';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons/faFolderPlus';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey';
import { faLevelUpAlt } from '@fortawesome/free-solid-svg-icons/faLevelUpAlt';
import { faList } from '@fortawesome/free-solid-svg-icons/faList';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faMusic } from '@fortawesome/free-solid-svg-icons/faMusic';
import { faRunning } from '@fortawesome/free-solid-svg-icons/faRunning';
import { faTerminal } from '@fortawesome/free-solid-svg-icons/faTerminal';
import { faTh } from '@fortawesome/free-solid-svg-icons/faTh';
import { faThLarge } from '@fortawesome/free-solid-svg-icons/faThLarge';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export enum ChonkyIconName {
    // Misc
    loading = 'loading',

    // Drag & drop
    dndDragging = 'dndDragging',
    dndCanDrop = 'dndCanDrop',
    dndCannotDrop = 'dndCannotDrop',

    checkActive = 'checkActive',
    checkInactive = 'checkInactive',
    desc = 'desc',
    asc = 'asc',
    list = 'list',
    folder = 'folder',
    folderCreate = 'folderCreate',
    folderOpen = 'folderOpen',
    smallThumbnail = 'smallThumbnail',
    largeThumbnail = 'largeThumbnail',
    folderChainSeparator = 'folderChainSeparator',
    dropdown = 'dropdown',
    download = 'download',
    upload = 'upload',
    trash = 'trash',
    directoryUp = 'directoryUp',
    fallbackIcon = 'fallbackIcon',
    symlink = 'symlink',
    hidden = 'hidden',

    // File types
    file = 'file',
    license = 'license',
    code = 'code',
    config = 'config',
    model = 'model',
    database = 'database',
    text = 'text',
    archive = 'archive',
    csv = 'csv',
    image = 'image',
    pdf = 'pdf',
    word = 'word',
    video = 'video',
    info = 'info',
    key = 'key',
    lock = 'lock',
    music = 'music',
    flash = 'flash',
    terminal = 'terminal',
    authors = 'authors',
    adobe = 'adobe',
    git = 'git',
    linux = 'linux',
    windows = 'windows',
    nodejs = 'nodejs',
    php = 'php',
    python = 'python',
    ubuntu = 'ubuntu',
}

const IconMap: { [iconName in ChonkyIconName]: any } = {
    // Misc
    [ChonkyIconName.loading]: faCircleNotch,

    // Drag & drop
    [ChonkyIconName.dndDragging]: faFistRaised,
    [ChonkyIconName.dndCanDrop]: faArrowDown,
    [ChonkyIconName.dndCannotDrop]: faTimes,

    [ChonkyIconName.checkActive]: faCheckCircle,
    [ChonkyIconName.checkInactive]: faCircle,
    [ChonkyIconName.desc]: faArrowDown,
    [ChonkyIconName.asc]: faArrowUp,
    [ChonkyIconName.list]: faList,
    [ChonkyIconName.folder]: faFolder,
    [ChonkyIconName.folderCreate]: faFolderPlus,
    [ChonkyIconName.folderOpen]: faFolderOpen,
    [ChonkyIconName.smallThumbnail]: faTh,
    [ChonkyIconName.largeThumbnail]: faThLarge,
    [ChonkyIconName.folderChainSeparator]: faChevronRight,
    [ChonkyIconName.dropdown]: faChevronDown,
    [ChonkyIconName.download]: faDownload,
    [ChonkyIconName.upload]: faUpload,
    [ChonkyIconName.trash]: faTrash,
    [ChonkyIconName.directoryUp]: faLevelUpAlt,
    [ChonkyIconName.fallbackIcon]: faExclamationTriangle,
    [ChonkyIconName.symlink]: faExternalLinkAlt,
    [ChonkyIconName.hidden]: faEyeSlash,

    // file types
    [ChonkyIconName.file]: faFile,
    [ChonkyIconName.license]: faBalanceScale,
    [ChonkyIconName.code]: faFileCode,
    [ChonkyIconName.config]: faCogs,
    [ChonkyIconName.model]: faCubes,
    [ChonkyIconName.database]: faDatabase,
    [ChonkyIconName.text]: faFileAlt,
    [ChonkyIconName.archive]: faFileArchive,
    [ChonkyIconName.csv]: faFileExcel,
    [ChonkyIconName.image]: faFileImage,
    [ChonkyIconName.pdf]: faFilePdf,
    [ChonkyIconName.word]: faFileWord,
    [ChonkyIconName.video]: faFilm,
    [ChonkyIconName.info]: faInfoCircle,
    [ChonkyIconName.key]: faKey,
    [ChonkyIconName.lock]: faLock,
    [ChonkyIconName.music]: faMusic,
    [ChonkyIconName.flash]: faRunning,
    [ChonkyIconName.terminal]: faTerminal,
    [ChonkyIconName.authors]: faUsers,
    [ChonkyIconName.adobe]: faAdobe,
    [ChonkyIconName.git]: faGitAlt,
    [ChonkyIconName.linux]: faLinux,
    [ChonkyIconName.windows]: faWindows,
    [ChonkyIconName.nodejs]: faNodeJs,
    [ChonkyIconName.php]: faPhp,
    [ChonkyIconName.python]: faPython,
    [ChonkyIconName.ubuntu]: faUbuntu,
} as const;

export interface ChonkyIconProps {
    icon: ChonkyIconName | string;
    spin?: boolean;
    className?: string;
    color?: string;
    fixedWidth?: boolean;
    size?: 'xs' | 'lg' | 'sm';
    style?: React.CSSProperties;
}

export const ChonkyIconFA: React.FC<ChonkyIconProps> = React.memo((props) => {
    const { icon } = props;

    const faProps = {
        ...props,
        icon: IconMap[icon] ? IconMap[icon] : IconMap.fallbackIcon,
    } as const;
    return <FontAwesomeIcon {...faProps} />;
});
