import {addReadme} from 'storybook-readme';
import {addDecorator, addParameters, configure} from '@storybook/react';

addDecorator(addReadme);

addParameters({
    // backgrounds: [
    //     {name: 'Grey', value: '#f2f2f2', default: true},
    // ],
});

function loadStories() {
    require('../stories/docs');
    require('../stories/examples');
}

configure(loadStories, module);
