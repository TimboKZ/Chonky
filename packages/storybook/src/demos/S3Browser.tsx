/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import AWS from 'aws-sdk';
import {
    ChonkyActions,
    ChonkyFileActionData,
    FileArray,
    FileBrowser,
    FileData,
    FileList,
    FileNavbar,
    FileToolbar,
    setChonkyDefaults,
} from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import path from 'path';
import React, { useCallback, useEffect, useState } from 'react';
import { useStoryLinks } from '../util';

setChonkyDefaults({ iconComponent: ChonkyIconFA });

// The AWS credentials below only have read-only access to the Chonky demo bucket.
// You will need to create custom credentials for your bucket.
const BUCKET_NAME = 'chonky-storybook-public-demo-bucket';
const BUCKET_REGION = 'eu-west-2';
const ACCESS_KEY_ID = 'AKIAQG22GSK3ZI4W3Q3T';
const SECRET_ACCESS_KEY = 'R6pUpu8BEf/4rJy5fgK6PJLvG07b8NLyucuSpSUK';

AWS.config.update({
    region: BUCKET_REGION,
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
});
const s3 = new AWS.S3();

const fetchS3BucketContents = (bucket: string, prefix: string): Promise<FileArray> => {
    return s3
        .listObjectsV2({
            Bucket: bucket,
            Delimiter: '/',
            Prefix: prefix !== '/' ? prefix : '',
        })
        .promise()
        .then((response) => {
            const chonkyFiles: FileArray = [];
            const s3Objects = response.Contents;
            const s3Prefixes = response.CommonPrefixes;

            if (s3Objects) {
                chonkyFiles.push(
                    ...s3Objects.map(
                        (object): FileData => ({
                            id: object.Key!,
                            name: path.basename(object.Key!),
                            modDate: object.LastModified,
                            size: object.Size,
                        })
                    )
                );
            }

            if (s3Prefixes) {
                chonkyFiles.push(
                    ...s3Prefixes.map(
                        (prefix): FileData => ({
                            id: prefix.Prefix!,
                            name: path.basename(prefix.Prefix!),
                            isDir: true,
                        })
                    )
                );
            }

            return chonkyFiles;
        });
};

const storyName = 'AWS S3 Browser';
export const S3Browser: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [folderPrefix, setKeyPrefix] = useState<string>('/');
    const [files, setFiles] = useState<FileArray>([]);

    useEffect(() => {
        fetchS3BucketContents(BUCKET_NAME, folderPrefix)
            .then(setFiles)
            .catch((error) => setError(error.message));
    }, [folderPrefix, setFiles]);

    const folderChain = React.useMemo(() => {
        let folderChain: FileArray;
        if (folderPrefix === '/') {
            folderChain = [];
        } else {
            let currentPrefix = '';
            folderChain = folderPrefix
                .replace(/\/*$/, '')
                .split('/')
                .map(
                    (prefixPart): FileData => {
                        currentPrefix = currentPrefix
                            ? path.join(currentPrefix, prefixPart)
                            : prefixPart;
                        return {
                            id: currentPrefix,
                            name: prefixPart,
                            isDir: true,
                        };
                    }
                );
        }
        folderChain.unshift({
            id: '/',
            name: BUCKET_NAME,
            isDir: true,
        });
        return folderChain;
    }, [folderPrefix]);

    const handleFileAction = useCallback(
        (data: ChonkyFileActionData) => {
            if (data.id === ChonkyActions.OpenFiles.id) {
                if (data.payload.files && data.payload.files.length !== 1) return;
                if (!data.payload.targetFile || !data.payload.targetFile.isDir) return;

                const newPrefix = `${data.payload.targetFile.id.replace(/\/*$/, '')}/`;
                console.log(`Key prefix: ${newPrefix}`);
                setKeyPrefix(newPrefix);
            }
        },
        [setKeyPrefix]
    );

    return (
        <div className="story-wrapper">
            <div className="story-description">
                <h1 className="story-title">{storyName}</h1>
                <p>
                    This example fetches data from a real S3 bucket. If you open the
                    "Network" tab of your browser's dev tools, you will see S3 API
                    requests being sent in real-time as you enter different folders.
                </p>
                <p>
                    Note that the AWS SDK in this example is configured to have{' '}
                    <strong>read-only</strong> access to Chonky's demo bucket, called
                    <code>{BUCKET_NAME}</code>. To use a custom bucket, you will need to
                    setup appropriate IAM roles and permissions. Please remember to
                    restrict public access to your data!
                </p>
                <div className="story-links">
                    {useStoryLinks([
                        { gitPath: '2.x_storybook/src/demos/S3Browser.tsx' },
                    ])}
                </div>
                {error && (
                    <div className="story-error">
                        An error has occurred while loading bucket:{' '}
                        <strong>{error}</strong>
                    </div>
                )}
            </div>
            <div style={{ height: 400 }}>
                <FileBrowser
                    instanceId={storyName}
                    files={files}
                    folderChain={folderChain}
                    onFileAction={handleFileAction}
                >
                    <FileNavbar />
                    <FileToolbar />
                    <FileList />
                </FileBrowser>
            </div>
        </div>
    );
};
(S3Browser as any).storyName = storyName;
