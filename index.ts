/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import {FileUtil} from './src/util/FileUtil';
import ConsoleUtil from './src/util/ConsoleUtil';
import FileBrowser from './src/components/FileBrowser';
import {handleKeyPress} from './src/components/ClickableWrapper';
import {setupListeners, isNil, registerKbListener} from './src/util/Util';
import {FolderView, Option, Options, SortProperty, SortOrder} from './src/typedef';

const {demoFileMap, demoRootFolderId} = FileUtil.getDemoFs();

if (!isNil(window)) {
    setupListeners();
    registerKbListener(handleKeyPress);
} else {
    ConsoleUtil.warn('`window` object was not found. Are we running in the browser?');
}

export {
    FileBrowser,
    FolderView, Option, Options, SortProperty, SortOrder,
    demoFileMap, demoRootFolderId,
};
