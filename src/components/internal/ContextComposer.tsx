/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';

export interface ContextProviderData<T = any> {
    provider: React.Provider<T>;
    value: T;
}

export interface ContextComposerProps {
    providers: ContextProviderData[];
}

/**
 * Takes an array of context providers and composes them into a
 * hierarchy:
 *
 * <Comp1 {...props}>
 *     <Comp2 {...props}>
 *         <Comp3 {...props}>
 *             {children}
 *         </Comp3>
 *     </Comp2>
 * </Comp1>
 */
export const ContextComposer: React.FC<ContextComposerProps> = (props) => {
    const { providers, children } = props;

    return (
        <React.Fragment>
            {providers.reduceRight((acc, data) => {
                const Provider = data.provider;
                return <Provider value={data.value}>{acc}</Provider>;
            }, children)}
        </React.Fragment>
    );
};
