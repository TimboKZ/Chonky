/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import { faAdobe } from '@fortawesome/free-brands-svg-icons/faAdobe';
import { faGitAlt } from '@fortawesome/free-brands-svg-icons/faGitAlt';
import { faLinux } from '@fortawesome/free-brands-svg-icons/faLinux';
import { faNodeJs } from '@fortawesome/free-brands-svg-icons/faNodeJs';
import { faPhp } from '@fortawesome/free-brands-svg-icons/faPhp';
import { faPython } from '@fortawesome/free-brands-svg-icons/faPython';
import { faRust } from '@fortawesome/free-brands-svg-icons/faRust';
import { faUbuntu } from '@fortawesome/free-brands-svg-icons/faUbuntu';
import { faWindows } from '@fortawesome/free-brands-svg-icons/faWindows';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { faBalanceScale } from '@fortawesome/free-solid-svg-icons/faBalanceScale';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons/faBoxOpen';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';
import { faCogs } from '@fortawesome/free-solid-svg-icons/faCogs';
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';
import { faCubes } from '@fortawesome/free-solid-svg-icons/faCubes';
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase';
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { faEraser } from '@fortawesome/free-solid-svg-icons/faEraser';
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
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faMusic } from '@fortawesome/free-solid-svg-icons/faMusic';
import { faObjectGroup } from '@fortawesome/free-solid-svg-icons/faObjectGroup';
import { faPaste } from '@fortawesome/free-solid-svg-icons/faPaste';
import { faRunning } from '@fortawesome/free-solid-svg-icons/faRunning';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons/faShareAlt';
import { faSortAmountDownAlt } from '@fortawesome/free-solid-svg-icons/faSortAmountDownAlt';
import { faSortAmountUpAlt } from '@fortawesome/free-solid-svg-icons/faSortAmountUpAlt';
import { faTerminal } from '@fortawesome/free-solid-svg-icons/faTerminal';
import { faTh } from '@fortawesome/free-solid-svg-icons/faTh';
import { faThLarge } from '@fortawesome/free-solid-svg-icons/faThLarge';
import { faThList } from '@fortawesome/free-solid-svg-icons/faThList';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faToggleOff } from '@fortawesome/free-solid-svg-icons/faToggleOff';
import { faToggleOn } from '@fortawesome/free-solid-svg-icons/faToggleOn';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChonkyIconName, ChonkyIconProps } from 'chonky';
import React from 'react';

const IconMap: { [iconName in ChonkyIconName]: any } = {
    // Misc
    [ChonkyIconName.loading]: faCircleNotch,
    [ChonkyIconName.dropdown]: faChevronDown,
    [ChonkyIconName.placeholder]: faMinus,

    // File Actions: Drag & drop
    [ChonkyIconName.dndDragging]: faFistRaised,
    [ChonkyIconName.dndCanDrop]: faArrowDown,
    [ChonkyIconName.dndCannotDrop]: faTimes,

    // File Actions: File operations
    [ChonkyIconName.openFiles]: faBoxOpen,
    [ChonkyIconName.openParentFolder]: faLevelUpAlt,
    [ChonkyIconName.copy]: faCopy,
    [ChonkyIconName.paste]: faPaste,
    [ChonkyIconName.share]: faShareAlt,
    [ChonkyIconName.search]: faSearch,
    [ChonkyIconName.selectAllFiles]: faObjectGroup,
    [ChonkyIconName.clearSelection]: faEraser,

    // File Actions: Sorting & options
    [ChonkyIconName.sortAsc]: faSortAmountDownAlt,
    [ChonkyIconName.sortDesc]: faSortAmountUpAlt,
    [ChonkyIconName.toggleOn]: faToggleOn,
    [ChonkyIconName.toggleOff]: faToggleOff,

    // File Actions: File Views
    [ChonkyIconName.list]: faList,
    [ChonkyIconName.compact]: faThList,
    [ChonkyIconName.smallThumbnail]: faTh,
    [ChonkyIconName.largeThumbnail]: faThLarge,

    // File Actions: Unsorted
    [ChonkyIconName.folder]: faFolder,
    [ChonkyIconName.folderCreate]: faFolderPlus,
    [ChonkyIconName.folderOpen]: faFolderOpen,
    [ChonkyIconName.folderChainSeparator]: faChevronRight,
    [ChonkyIconName.download]: faDownload,
    [ChonkyIconName.upload]: faUpload,
    [ChonkyIconName.trash]: faTrash,
    [ChonkyIconName.fallbackIcon]: faExclamationTriangle,

    // File modifiers
    [ChonkyIconName.symlink]: faExternalLinkAlt,
    [ChonkyIconName.hidden]: faEyeSlash,

    // Generic file types
    [ChonkyIconName.file]: faFile,
    [ChonkyIconName.license]: faBalanceScale,
    [ChonkyIconName.code]: faFileCode,
    [ChonkyIconName.config]: faCogs,
    [ChonkyIconName.model]: faCubes,
    [ChonkyIconName.database]: faDatabase,
    [ChonkyIconName.text]: faFileAlt,
    [ChonkyIconName.archive]: faFileArchive,
    [ChonkyIconName.image]: faFileImage,
    [ChonkyIconName.video]: faFilm,
    [ChonkyIconName.info]: faInfoCircle,
    [ChonkyIconName.key]: faKey,
    [ChonkyIconName.lock]: faLock,
    [ChonkyIconName.music]: faMusic,
    [ChonkyIconName.terminal]: faTerminal,
    [ChonkyIconName.users]: faUsers,

    // OS file types
    [ChonkyIconName.linux]: faLinux,
    [ChonkyIconName.ubuntu]: faUbuntu,
    [ChonkyIconName.windows]: faWindows,

    // Programming language file types
    [ChonkyIconName.rust]: faRust,
    [ChonkyIconName.python]: faPython,
    [ChonkyIconName.nodejs]: faNodeJs,
    [ChonkyIconName.php]: faPhp,

    // Development tools file types
    [ChonkyIconName.git]: faGitAlt,

    // Brands file types
    [ChonkyIconName.adobe]: faAdobe,

    // Other program file types
    [ChonkyIconName.pdf]: faFilePdf,
    [ChonkyIconName.excel]: faFileExcel,
    [ChonkyIconName.word]: faFileWord,
    [ChonkyIconName.flash]: faRunning,
} as const;

export const ChonkyIconFA: React.FC<ChonkyIconProps> = React.memo((props) => {
    const { icon } = props;

    let faIcon: any; // FontAwesome `IconDefinition`
    if (typeof icon === 'object') faIcon = icon;
    else faIcon = IconMap[icon] ?? IconMap.fallbackIcon;

    const faProps = {
        ...props,
        icon: faIcon,
    } as const;
    return <FontAwesomeIcon {...faProps} />;
});
