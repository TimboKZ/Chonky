/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import {ReactWrapper} from 'enzyme';

import {FileData} from '../src/typedef';

export const waitFor = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds));
export const generateTestId = () => Math.random().toString(36).substr(2, 9);
export const generateTestFiles = (count: number = 10, extraProps: Partial<FileData> = {}): FileData[] => {
    const array = new Array(count);
    for (let i = 0; i < count; ++i) {
        array[i] = {
            id: `${generateTestId()}_${i}`,
            name: `Random File ${i + 1}`,
            isDir: Math.random() > 0.5,
            ...extraProps,
        };
    }
    return array;
};
export const simulateEntryClick = (entry: ReactWrapper, double: boolean = false) => {
    const clickableDiv = entry.find('div').first();
    clickableDiv.simulate('click');
    if (double) clickableDiv.simulate('click');
};
export const simulateEntryKeypress = (entry: ReactWrapper, double: boolean = false) => {
    const clickableDiv = entry.find('div').first();
    if (double) clickableDiv.simulate('keyDown', {key: 'Enter'});
    else clickableDiv.simulate('keyDown', {key: ' '});
};
