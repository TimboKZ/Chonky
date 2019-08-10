/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import FileBrowser from './src/components/FileBrowser';
import {FolderView, Option, Options, SortProperty, SortOrder} from './src/typedef';
import {FileUtil} from './src/util/FileUtil';

const {demoFileMap, demoRootFolderId} = FileUtil.getDemoFs();

export {
    FileBrowser,
    FolderView, Option, Options, SortProperty, SortOrder,
    demoFileMap, demoRootFolderId,
};
