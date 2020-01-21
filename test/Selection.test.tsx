/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import sinon from 'sinon';
import React from 'react';
import { assert } from 'chai';
import { mount } from 'enzyme';

import { waitFor, generateTestFiles, simulateEntryKeypress } from './TestUtil';
import FileBrowser from '../src/components/FileBrowser';
import FileListEntry from '../src/components/FileListEntry';

// TODO: Extend these tests

test('Space triggers onSelection(...)', async () => {
  let selectionSize = 0;
  const selectionSpy = sinon.spy(selection => {
    let count = 0;
    for (const _ in selection) count++;
    selectionSize = count;
  });
  const demoFiles = generateTestFiles(10);
  const fileBrowser = mount(
    <FileBrowser files={demoFiles} onSelectionChange={selectionSpy} />
  );
  const fileEntries = fileBrowser.find(FileListEntry);

  simulateEntryKeypress(fileEntries.at(0));
  await waitFor(10);
  assert.equal(selectionSize, 1);

  simulateEntryKeypress(fileEntries.at(8));
  await waitFor(10);
  assert.equal(selectionSize, 2);

  simulateEntryKeypress(fileEntries.at(0));
  await waitFor(10);
  assert.equal(selectionSize, 1);

  simulateEntryKeypress(fileEntries.at(4));
  await waitFor(10);
  assert.equal(selectionSize, 2);
});
