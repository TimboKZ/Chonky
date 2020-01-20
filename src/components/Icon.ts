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
} as const;

export const Icon = FontAwesomeIcon;
