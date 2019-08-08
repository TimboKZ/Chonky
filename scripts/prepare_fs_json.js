/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

const md5 = require('md5');
const path = require('path');
const fs = require('fs-extra');
const Promise = require('bluebird');
const ThumbnailGenerator = require('fs-thumbnail');

const getFileId = filePath => md5(filePath).substring(0, 12);

const thumbDirPath = path.resolve(__dirname, '..', 'static', 'thumbnails');
const thumbGen = new ThumbnailGenerator({verbose: false, size: 300, quality: 60});

const readFile = (filePath, parentFile) => {
    const id = getFileId(filePath);
    const parsed = path.parse(filePath);
    let thumbnailUrl = undefined;
    const thumbName = `${parsed.name}.jpg`;
    return Promise.resolve()
        .then(() => thumbGen.getThumbnail({
            path: filePath,
            output: path.join(thumbDirPath, thumbName),
        }))
        .then(thumbnailPath => {
            thumbnailUrl = thumbnailPath ? `./thumbnails/${thumbName}` : undefined;
        })
        .then(() => fs.lstat(filePath))
        .then(stats => {
            return {
                id,

                base: parsed.base,
                name: parsed.name,
                ext: parsed.ext,

                isDir: stats.isDirectory(),
                isHidden: parsed.name.charAt(0) === '.',
                isSymlink: stats.isSymbolicLink(),

                size: stats.isDirectory() ? null : stats.size,
                modDate: stats.ctime,

                parentId: parentFile ? parentFile.id : null,
                childrenIds: stats.isDirectory ? [] : null,

                // Custom properties
                thumbnailUrl,
            };
        });
};

const readDir = (dirPath, parentFile) => {
    return fs.readdir(dirPath)
        .then(files => {
            const filePromises = new Array(files.length);
            for (let i = 0; i < files.length; ++i) {
                const filePath = path.join(dirPath, files[i]);
                filePromises[i] = readFile(filePath, parentFile);
            }
            return Promise.all(filePromises);
        });
};

const dirToFsTree = (fileMap, dirPath, parentFile) => {
    return readDir(dirPath, parentFile)
        .then(files => {
            const promises = [];
            for (const file of files) {
                const skipFile = file.base === 'node_modules'
                    || file.base === '.git'
                    || file.base === 'public'
                    || file.base === 'docs'
                    || file.base === '.idea';
                if (skipFile) continue;

                fileMap[file.id] = file;
                if (parentFile) parentFile.childrenIds.push(file.id);
                if (file.isDir) promises.push(dirToFsTree(fileMap, path.join(dirPath, file.base), file));
            }
            return Promise.all(promises);
        });
};

const prepareFsJson = (rootPath, outPath) => {
    let rootFile;
    const fileMap = {};
    readFile(rootPath, null)
        .then(file => {
            fileMap[file.id] = file;
            rootFile = file;
        })
        .then(() => dirToFsTree(fileMap, rootPath, rootFile))
        .then(() => fs.writeFile(outPath, JSON.stringify({rootFolderId: rootFile.id, fileMap}, null, 2)))
        .catch(console.error);
};

const chonkyProjectDir = path.resolve(__dirname, '..');
const japanPicsDir = path.resolve(__dirname, '..', '..', '..', 'misc', 'Images with thumbnails');
const storiesUtilDir = path.resolve(__dirname, '..', 'stories', 'util');

Promise.resolve()
    .then(() => {
        return prepareFsJson(chonkyProjectDir, path.join(storiesUtilDir, 'chonky_project.fs_map.json'));
    })
    .then(() => {
        fileMap = {};
        return prepareFsJson(japanPicsDir, path.join(storiesUtilDir, 'japan_pics.fs_map.json'));
    });


