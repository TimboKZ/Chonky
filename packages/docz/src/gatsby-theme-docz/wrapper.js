import './index.css';

import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Helmet } from 'react-helmet-async';

setChonkyDefaults({ iconComponent: ChonkyIconFA, disableDragAndDropProvider: true });

const Wrapper = ({ children, doc }) => {
    useEffect(() => {
        const mainContainerClass = 'chonky-main-container';
        const mainContainer = document
            .getElementsByClassName(mainContainerClass)
            .item(0);
        if (!mainContainer) {
            console.error(
                `Could not find element with the class .${mainContainer}, some links ` +
                    `might be broken.`
            );
        } else {
            const links = mainContainer.getElementsByTagName('a');
            for (const link of links) {
                const href = link.getAttribute('href');
                if (href.startsWith('http') || href.startsWith('#') || href === '/') {
                    continue;
                }
                if (href.startsWith('/docs')) continue;
                if (href.startsWith('/storybook')) continue;

                const fixedHref = `/docs/2.x${href}`;
                link.setAttribute('href', fixedHref);
            }
        }
    });

    return (
        <React.Fragment>
            <Helmet>
                <meta charSet="utf-8" />
                <link
                    rel="icon"
                    type="image/png"
                    href="https://chonky.io/chonky-sphere-v2.png"
                />
            </Helmet>
            <DndProvider backend={HTML5Backend}>
                <div className="chonky-main-container">{children}</div>
            </DndProvider>
        </React.Fragment>
    );
};

export default Wrapper;
