import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons/faArrowDown";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";
import { faFolder } from "@fortawesome/free-solid-svg-icons/faFolder";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons/faFolderPlus";
import { faTh } from "@fortawesome/free-solid-svg-icons/faTh";
import { faThLarge } from "@fortawesome/free-solid-svg-icons/faThLarge";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons/faArrowUp";
import { faCircle } from "@fortawesome/free-solid-svg-icons/faCircle";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faLevelUpAlt } from "@fortawesome/free-solid-svg-icons/faLevelUpAlt";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons/faFolderOpen";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons/faExternalLinkAlt";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons/faEyeSlash";
import { faBalanceScale } from "@fortawesome/free-solid-svg-icons/faBalanceScale";
import { faFileCode } from "@fortawesome/free-solid-svg-icons/faFileCode";
import { faCogs } from "@fortawesome/free-solid-svg-icons/faCogs";
import { faCubes } from "@fortawesome/free-solid-svg-icons/faCubes";
import { faDatabase } from "@fortawesome/free-solid-svg-icons/faDatabase";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons/faFileAlt";
import { faFileArchive } from "@fortawesome/free-solid-svg-icons/faFileArchive";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons/faFileExcel";
import { faFileImage } from "@fortawesome/free-solid-svg-icons/faFileImage";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons/faFilePdf";
import { faFileWord } from "@fortawesome/free-solid-svg-icons/faFileWord";
import { faFilm } from "@fortawesome/free-solid-svg-icons/faFilm";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import { faKey } from "@fortawesome/free-solid-svg-icons/faKey";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";
import { faRunning } from "@fortawesome/free-solid-svg-icons/faRunning";
import { faTerminal } from "@fortawesome/free-solid-svg-icons/faTerminal";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import { faAdobe } from "@fortawesome/free-brands-svg-icons/faAdobe";
import { faGitAlt } from "@fortawesome/free-brands-svg-icons/faGitAlt";
import { faLinux } from "@fortawesome/free-brands-svg-icons/faLinux";
import { faNodeJs } from "@fortawesome/free-brands-svg-icons/faNodeJs";
import { faPhp } from "@fortawesome/free-brands-svg-icons/faPhp";
import { faPython } from "@fortawesome/free-brands-svg-icons/faPython";
import { faUbuntu } from "@fortawesome/free-brands-svg-icons/faUbuntu";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import { faFile } from '@fortawesome/free-solid-svg-icons/faFile';

export const icons = {
  checkActive: faCheckCircle,
  checkInactive: faCircle,
  desc: faArrowDown,
  asc: faArrowUp,
  list: faList,
  folder: faFolder,
  folderCreate: faFolderPlus,
  folderOpen: faFolderOpen,
  smallThumbnail: faTh,
  largetThumbnail: faThLarge,
  angleRight: faChevronRight,
  angleDown: faChevronDown,
  download: faDownload,
  upload: faUpload,
  trash: faTrash,
  directoryUp: faLevelUpAlt,
  fallbackIcon: faExclamationTriangle,
  symlink: faExternalLinkAlt,
  hidden: faEyeSlash,
  loading: faCircleNotch,

  // file types
  file: faFile,
  license: faBalanceScale,
  code: faFileCode,
  config: faCogs,
  model: faCubes,
  database: faDatabase,
  text: faFileAlt,
  archive: faFileArchive,
  csv: faFileExcel,
  image: faFileImage,
  pdf: faFilePdf,
  word: faFileWord,
  video: faFilm,
  info: faInfoCircle,
  key: faKey,
  lock: faLock,
  music: faMusic,
  flash: faRunning,
  terminal: faTerminal,
  authors: faUsers,
  adobe: faAdobe,
  git: faGitAlt,
  linux: faLinux,
  nodejs: faNodeJs,
  php: faPhp,
  python: faPython,
  ubuntu: faUbuntu,
} as const;

export const Icon = FontAwesomeIcon;
