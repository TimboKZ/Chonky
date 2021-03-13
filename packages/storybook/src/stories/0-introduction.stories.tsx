import React from 'react';

export default {
    title: 'Introduction',
};

export const About: React.FC = () => {
    return (
        <div className="story-wrapper">
            <div className="story-description">
                <h1 className="story-title">Chonky v2.x Storybook</h1>
                <p>
                    This is the Storybook for Chonky v2.x. It contains code examples for
                    different Chonky use cases. Please use the sidebar to choose a
                    relevant story.
                </p>
                <h2 className="story-title">Available resources</h2>
                <p>Chonky v2.x documentation consists of three parts:</p>
                <ol>
                    <li>
                        <a href="https://chonky.io/">Landing page</a>. This page
                        contains the list of features Chonky supports, and a simple File
                        Browser demo.
                    </li>
                    <li>
                        <a href="https://chonky.io/docs/2.x/">Documentation site</a>.
                        This site contains detailed documentation of Chonky features and
                        some short code snippets.
                    </li>
                    <li className="css-q43a5f">
                        <a href="https://chonky.io/storybook/2.x/">Storybook</a>{' '}
                        <strong>(you are here)</strong>. This site contains real world
                        examples of how Chonky can be used. It also showcases advanced
                        usage of Chonky components.
                    </li>
                </ol>
            </div>
        </div>
    );
};
