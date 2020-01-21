/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';

import FileBrowser from '../src/components/FileBrowser';
import FileListEntry from '../src/components/FileListEntry';
import {
  generateTestFiles,
  simulateEntryClick,
  simulateEntryKeypress,
} from './TestUtil';

const demoFile = {
  id: 'demo-file',
  name: 'My Demo File',
};

const Delay = (seconds: number) =>
  new Promise(resolve => setTimeout(resolve, seconds));

test('Single click and space triggers single click handler', async () => {
  const clickSpy = sinon.spy();
  const demoFiles = generateTestFiles(10);

  const fileBrowser = mount<FileBrowser>(
    <FileBrowser files={demoFiles} onFileSingleClick={clickSpy} />
  );
  const doubleClickDelay = fileBrowser.props().doubleClickDelay as number;
  const fileEntries = fileBrowser.find(FileListEntry);

  // Try a single click
  simulateEntryClick(fileEntries.at(0));
  await Delay(10);
  expect(clickSpy.callCount).to.be.equal(1);

  // Try a double click and make sure only first click counts as single
  simulateEntryClick(fileEntries.at(1));
  await Delay(doubleClickDelay / 4);
  simulateEntryClick(fileEntries.at(1));
  expect(clickSpy.callCount).to.be.equal(2);

  // Single click triggered via KB
  simulateEntryKeypress(fileEntries.at(2));
  await Delay(10);
  expect(clickSpy.callCount).to.be.equal(3);

  // Double click triggered via KB shouldn't change count
  simulateEntryKeypress(fileEntries.at(3), true);
  await Delay(10);
  expect(clickSpy.callCount).to.be.equal(3);
});

test('Double click triggers double click handler', async () => {
  const clickSpy = sinon.spy();
  const fileBrowser = mount(
    <FileBrowser files={[demoFile]} onFileDoubleClick={clickSpy} />
  );
  const clickablePart = fileBrowser
    .find(FileListEntry)
    .first()
    .find('div')
    .first();

  clickablePart.simulate('click');
  clickablePart.simulate('click');
  await Delay(10);
  expect(clickSpy.callCount).to.be.equal(1);
});
