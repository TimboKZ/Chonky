/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import {FileUtil} from './util/FileUtil';
import FileBrowser from './components/FileBrowser';
import {FileView, InputEventType, KbKey, Option, Options, SortProperty, SortOrder} from './typedef';

const {demoFileMap, demoRootFolderId} = FileUtil.getDemoFs();

export {
    FileBrowser,
    FileView, InputEventType, KbKey, Option, Options, SortProperty, SortOrder,
    demoFileMap, demoRootFolderId,
};
