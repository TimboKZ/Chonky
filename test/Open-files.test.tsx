/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import sinon from 'sinon';
import React from 'react';
import {assert} from 'chai';
import {mount} from 'enzyme';

import {InputEventType} from '../src';
import FileBrowser from '../src/components/FileBrowser';
import FileListEntry from '../src/components/FileListEntry';
import {waitFor, generateTestFiles, simulateEntryClick, simulateEntryKeypress} from './TestUtil';
import {FileData, InputEvent} from '../src/typedef';
import {isNil} from '../src/util/Util';

test('Double click calls onFileOpen(...)', async () => {
    let file, inputEvent;
    const openSpy = sinon.spy();
    const demoFiles = generateTestFiles(10);

    const fileBrowser = mount<FileBrowser>(<FileBrowser files={demoFiles} onFileOpen={openSpy}/>);
    const fileEntries = fileBrowser.find(FileListEntry);

    // Try a single click
    simulateEntryClick(fileEntries.at(0));
    await waitFor(10);
    assert.equal(openSpy.callCount, 0);

    // Try a double click and check that correct object and event type is passed
    simulateEntryClick(fileEntries.at(1), true);
    await waitFor(10);
    assert.equal(openSpy.callCount, 1);
    [file, inputEvent] = openSpy.getCall(0).args as [FileData, InputEvent];
    assert.isObject(file);
    assert.equal(inputEvent.type, InputEventType.Mouse);
});

test('Enter keypress calls onFileOpen(...)', async () => {
    let file, inputEvent;
    const openSpy = sinon.spy();
    const demoFiles = generateTestFiles(10);

    const fileBrowser = mount<FileBrowser>(<FileBrowser files={demoFiles} onFileOpen={openSpy}/>);
    const fileEntries = fileBrowser.find(FileListEntry);

    // Try a Space
    simulateEntryKeypress(fileEntries.at(0));
    await waitFor(10);
    assert.equal(openSpy.callCount, 0);

    // Try Enter
    simulateEntryKeypress(fileEntries.at(1), true);
    await waitFor(10);
    assert.equal(openSpy.callCount, 1);
    [file, inputEvent] = openSpy.getCall(0).args as [FileData, InputEvent];
    assert.isObject(file);
    assert.equal(inputEvent.type, InputEventType.Keyboard);
});

test('onOpenFiles(...) called after onFileOpen(...)', async () => {
    let mainFile: FileData, mainFileIsNull = true, selectedFiles, inputEvent;
    const singleOpenSpy = sinon.spy((file, event) => {
        mainFile = file;
        return false;
    });
    const multiOpenSpy = sinon.spy((files, event) => {
        mainFileIsNull = isNil(mainFile);
        return false;
    });
    const demoFiles = generateTestFiles(10);

    const fileBrowser = mount<FileBrowser>(<FileBrowser files={demoFiles}
                                                        onFileOpen={singleOpenSpy}
                                                        onOpenFiles={multiOpenSpy}/>);
    const fileEntries = fileBrowser.find(FileListEntry);

    simulateEntryKeypress(fileEntries.at(0));
    simulateEntryKeypress(fileEntries.at(1));
    simulateEntryKeypress(fileEntries.at(2));
    simulateEntryKeypress(fileEntries.at(3));
    await waitFor(10);
    simulateEntryKeypress(fileEntries.at(4), true);
    await waitFor(10);
    assert.equal(singleOpenSpy.callCount, 1);
    assert.equal(multiOpenSpy.callCount, 1);

    [mainFile, inputEvent] = singleOpenSpy.getCall(0).args as [FileData, InputEvent];
    [selectedFiles, inputEvent] = multiOpenSpy.getCall(0).args as [FileData[], InputEvent];
    assert.equal(inputEvent.type, InputEventType.Keyboard);
    assert.equal(mainFileIsNull, false);
    assert.equal(selectedFiles.length, 4);
});
