/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import { Code } from 'gatsby-theme-docz/src/components/Code';
import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Nilable } from 'tsdef';
import { DeclarationReflection } from 'typedoc';

import { renderType, useActionFields, useTypeComment } from './type-util';

export interface TypeChildProps {
    node: DeclarationReflection;
    overrideType?: string;
    hideOptionalFlags: boolean;
    renderDescription?: (
        description: Nilable<string>,
        node: DeclarationReflection
    ) => string;
}

export const TypeChild: React.FC<TypeChildProps> = ({
    node,
    overrideType,
    hideOptionalFlags,
    renderDescription,
}) => {
    const { kind, name, description, flags } = useTypeComment(node);

    const { payloadCode } = useActionFields(node);

    const descriptionComponent = useMemo(() => {
        return renderDescription ? (
            renderDescription(description, node)
        ) : (
            <ReactMarkdown>{description}</ReactMarkdown>
        );
    }, [renderDescription, description, node]);

    return (
        <div className="docs-field">
            <div className="docs-title">
                <div className="docs-title-code">
                    <span className="docs-title-name">{name}</span>:
                    <span className="docs-title-type">
                        {overrideType ??
                            renderType({ node, optional: flags.isOptional })}
                    </span>
                </div>
                <span className="docs-title-kind">{kind}</span>
                {!hideOptionalFlags &&
                    (flags.isOptional ? (
                        <span className="docs-title-optional">Optional</span>
                    ) : (
                        <span className="docs-title-required">Required</span>
                    ))}
            </div>
            <div className="docs-description">
                {descriptionComponent}

                {payloadCode && (
                    <div className="docs-description-payload">
                        <Code className="language-typescript">{payloadCode}</Code>
                    </div>
                )}
            </div>
        </div>
    );
};
