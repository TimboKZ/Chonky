import { describe, it } from '@jest/globals';
import React from 'react';

import { FileBrowserDemo } from '../stories/02-Demos/01-File-Browser-demo.stories';

describe.each([[FileBrowserDemo.displayName, FileBrowserDemo]])(
    '%s component',
    (componentName, Component) => {
        it('Renders without error', () => {
            <Component />;
        });
    }
);
