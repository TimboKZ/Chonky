/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Nilable } from 'tsdef';
import { DeclarationReflection } from 'typedoc';
import './type-style.css';

import { useInterfaceData, useTypeComment } from './type-util';
import { TypeChild } from './TypeChild';

export interface InterfaceDocsProps {
    symbol: string;
    overrideChildrenType?: string;
    hideOptionalFlags?: boolean;
    renderDescription?: (
        description: Nilable<string>,
        node: DeclarationReflection
    ) => string;
}

export const TypeDocs: React.FC<InterfaceDocsProps> = ({
    symbol,
    overrideChildrenType,
    hideOptionalFlags,
    renderDescription,
}) => {
    const { data, children, source } = useInterfaceData(symbol);
    const { kind, name, description } = useTypeComment(data as any);

    const sourceLink = useMemo(
        () =>
            `https://github.com/TimboKZ/Chonky/tree/2.x/packages/chonky` +
            `/${source.fileName}#L${source.line}`,
        [source]
    );

    const fieldComponents = useMemo(
        () =>
            children.map((node, index) => (
                <TypeChild
                    key={`child-${index}`}
                    node={node}
                    overrideType={overrideChildrenType}
                    hideOptionalFlags={!!hideOptionalFlags}
                    renderDescription={renderDescription}
                />
            )),
        [children]
    );

    return (
        <React.Fragment>
            <div className="docs-wrapper">
                <h2>
                    <code>{name}</code> {kind}
                </h2>
                {description && <ReactMarkdown>{description}</ReactMarkdown>}
                <p>
                    Source code on GitHub:{' '}
                    <a href={sourceLink}>
                        <code>{source.fileName}</code>
                    </a>
                </p>
                {fieldComponents}
            </div>
            {/*<pre style={{ fontSize: 10, lineHeight: '10px' }}>*/}
            {/*    {JSON.stringify(data, null, 4)}*/}
            {/*</pre>*/}
        </React.Fragment>
    );
};
