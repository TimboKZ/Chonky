/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import {FileUtil} from './util/FileUtil';
import ConsoleUtil from './util/ConsoleUtil';
import FileBrowser from './components/FileBrowser';
import {handleKeyPress} from './components/ClickableWrapper';
import {setupListeners, isNil, registerKbListener} from './util/Util';
import {FileView, Option, Options, SortProperty, SortOrder} from './types/typedef';

const {demoFileMap, demoRootFolderId} = FileUtil.getDemoFs();

if (!isNil(window)) {
    setupListeners();
    registerKbListener(handleKeyPress);
} else {
    ConsoleUtil.warn('`window` object was not found. Are we running in the browser?');
}

export {
    FileBrowser,
    FileView, Option, Options, SortProperty, SortOrder,
    demoFileMap, demoRootFolderId,
};
