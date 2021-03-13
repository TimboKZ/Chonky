import { useMemo } from 'react';
import {
    ContainerReflection,
    DeclarationReflection,
    SignatureReflection,
} from 'typedoc';
import {
    ArrayType,
    IndexedAccessType,
    IntersectionType,
    IntrinsicType,
    ReferenceType,
    ReflectionType,
    StringLiteralType,
    TypeOperatorType,
    UnionType,
    UnknownType,
} from 'typedoc/dist/lib/models';

import typedocDataRaw from '../typedoc.json';

const typedocData = (typedocDataRaw as unknown) as ContainerReflection;

const asd: any = {};
asd.signatures;

export const findSymbolData = (symbol: string) => {
    const data = typedocData.children!.find((item) => item.name === symbol);
    if (!data) throw new Error(`Could not find symbol ${symbol}.`);
    return data;
};

export const useInterfaceData = (symbol: string) => {
    return useMemo(() => {
        const data = findSymbolData(symbol);

        // Sort by line number
        const children: any[] = data.children ?? [];
        const getSourcePosition = (node: any) => {
            const { line, character } = node.sources[0];
            return parseFloat(`${line}.${character}`);
        };
        children.sort((a: any, b: any) => {
            const x = getSourcePosition(a);
            const y = getSourcePosition(b);
            if (x < y) return -1;
            if (x > y) return 1;
            return 0;
        });

        return {
            data,
            children,
            source: data.sources![0],
        };
    }, [symbol]);
};

export const useTypeComment = (node: DeclarationReflection) => {
    return useMemo(() => {
        const signature = node.signatures ? (node.signatures as any[])[0] : {};

        const kind = (node.kindString || '<unknown-kind>') as string;
        const name = (node.name || node.id || '<unknown-field>') as string;
        const description =
            ((node.comment as any)?.shortText as string) ||
            signature.comment?.shortText ||
            undefined;
        const flags = (node.flags as any) ?? {};

        return { kind, name, description, flags };
    }, [node]);
};

export const useActionFields = (node: DeclarationReflection) => {
    return useMemo(() => {
        let payloadCode = '';
        const typeArguments = (node as any).type?.typeArguments;
        if (typeArguments) {
            const children = typeArguments[0].declaration?.children;
            if (children) {
                const data = children.find((o: any) => o.name === '__payloadType');
                if (data && data.type?.name) {
                    const payloadTypeName = data.type.name;
                    const payloadTypeData = findSymbolData(payloadTypeName);
                    const payloadType = renderType({
                        node: payloadTypeData,
                        optional: false,
                    });
                    payloadCode = `type ${payloadTypeName} = ${payloadType}`;
                    // payloadCode += '\n\n' + JSON.stringify(payloadTypeData, null, 4);
                }
            }
        }

        return { payloadCode };
    }, [node]);
};

export const renderTypeChildren = (
    children: DeclarationReflection[],
    indent: number = 4,
    lineEnd = ';'
) => {
    const strings = [];
    for (const child of children) {
        strings.push(
            `${child.name}: ${renderType({
                node: child,
                optional: child.flags.isOptional,
            })}`
        );
    }

    let type = '';
    for (const string of strings) {
        type += '\n' + ' '.repeat(indent) + string + lineEnd;
    }
    return '{' + type + '\n}';
};

export const renderType = ({
    node,
    optional,
}: {
    node: DeclarationReflection;
    optional: boolean;
}): string => {
    if (!node) return '<null-node>';
    if (node.children) return renderTypeChildren(node.children);
    if (node.type) return _renderTypeRecursive(node.type as any, optional);
    if (node.signatures) return _renderSignature(node.signatures[0] as any, optional);
    return '<unknown-node>';
};

export const _renderTypeRecursive = (
    type:
        | IntrinsicType
        | ReferenceType
        | UnionType
        | ArrayType
        | TypeOperatorType
        | ReflectionType
        | IntersectionType
        | StringLiteralType
        | IndexedAccessType
        | UnknownType,
    optional: boolean = false
): string => {
    if (type) {
        if (type.type === 'intrinsic' || type.type === 'typeParameter') {
            return type.name;
        } else if (type.type === 'stringLiteral') {
            return `'${type.value}'`;
        } else if (type.type === 'indexedAccess') {
            return `${_renderTypeRecursive(type.objectType)}[${_renderTypeRecursive(
                type.indexType
            )}]`;
        } else if (type.type === 'reference') {
            if (type.typeArguments) {
                const args = type.typeArguments.map(_renderTypeRecursive).join(', ');
                return `${type.name}<${args}>`;
            } else {
                return type.name;
            }
        } else if (type.type === 'union' || type.type === 'intersection') {
            let typeString: string;
            if (optional) {
                typeString = type.types
                    .map(_renderTypeRecursive)
                    .filter((t: string) => t !== 'undefined')
                    .join(' | ');
            } else {
                typeString = type.types
                    .map(_renderTypeRecursive)
                    .join(type.type === 'union' ? ' | ' : ' & ');
            }
            typeString = typeString.replace('false | true', 'boolean');
            return typeString;
        } else if (type.type === 'array') {
            return `${_renderTypeRecursive(type.elementType)}[]`;
        } else if (type.type === 'typeOperator') {
            return `${type.operator} ${_renderTypeRecursive(type.target)}`;
        } else if (type.type === 'reflection') {
            return renderType({ node: type.declaration });
        }
    }

    return `<unknown-type>`;
};

export const _renderSignature = (
    signature: SignatureReflection,
    optional: boolean
): string => {
    const parameters = signature.parameters ?? [];
    const paramStrings = parameters.map((node) => {
        const name = node.name + (node.flags.isOptional ? '?' : '');
        const type = renderType({ node: node, optional: node.flags.isOptional });
        return `${name}: ${type}`;
    });
    return `(${paramStrings.join(', ')}) => ${renderType({ node: signature })}`;
};
