/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {mount} from 'enzyme';

import FileBrowser from '../src/components/FileBrowser';
import FileListEntry from '../src/components/FileListEntry';

const demoFile = {
    id: 'demo-file',
    name: 'My Demo File',
};

const Delay = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds));

test('Single click and space triggers single click handler', async () => {
    const clickSpy = sinon.spy();
    const fileBrowser = mount(<FileBrowser files={[demoFile]} onFileSingleClick={clickSpy}/>);
    const clickableDiv = fileBrowser.find((FileListEntry)).first().find('div').first();

    clickableDiv.simulate('click');
    await Delay(10);
    expect(clickSpy.callCount).to.be.equal(1);

    // @ts-ignore
    clickableDiv.prop('onFocus')() ;
    clickableDiv.simulate('keyDown', {keyCode: 32});
    await Delay(10);
    expect(clickSpy.callCount).to.be.equal(1);
});

test('Double click triggers double click handler', async () => {
    const clickSpy = sinon.spy();
    const fileBrowser = mount(<FileBrowser files={[demoFile]} onFileDoubleClick={clickSpy}/>);
    const clickablePart = fileBrowser.find((FileListEntry)).first().find('div').first();

    clickablePart.simulate('click');
    clickablePart.simulate('click');
    await Delay(10);
    expect(clickSpy.callCount).to.be.equal(1);
});
