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

const thumbDirPath = path.resolve(__dirname, '..', 'assets', 'thumbnails');
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
            const file = {
                id,
                name: parsed.base,
                modDate: stats.ctime,
            };
            if (stats.isDirectory()) file.isDir = true;
            if (parsed.name.charAt(0) === '.') file.isHidden = true;
            if (stats.isSymbolicLink()) file.isSymlink = true;
            if (parentFile) file.parentId = parentFile.id;
            if (stats.isDirectory()) {
                file.childrenIds = [];
            } else {
                file.size = stats.size;
            }

            // Custom property
            if (thumbnailUrl) file.thumbnailUrl = thumbnailUrl;

            return file;
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
                const skipFile = file.name === 'node_modules'
                    || file.name === '.git'
                    || file.name === 'public'
                    || file.name === 'thumbnails'
                    || file.name === '.idea';
                if (skipFile) continue;

                fileMap[file.id] = file;
                if (parentFile) parentFile.childrenIds.push(file.id);
                if (file.isDir) promises.push(dirToFsTree(fileMap, path.join(dirPath, file.name), file));
            }
            return Promise.all(promises);
        });
};

const prepareFsJson = (rootPath, outPath, customRootFolderName) => {
    let rootFile;
    const fileMap = {};
    return readFile(rootPath, null)
        .then(file => {
            if (customRootFolderName) {
                file.name = customRootFolderName;
            }
            fileMap[file.id] = file;
            rootFile = file;
        })
        .then(() => dirToFsTree(fileMap, rootPath, rootFile))
        .then(() => fs.writeFile(outPath, JSON.stringify({rootFolderId: rootFile.id, fileMap}, null, 2)))
        .then(() => ({rootFolderId: rootFile.id, fileMap}));
};

const chonkyProjectDir = path.resolve(__dirname, '..');
const japanPicsDir = path.resolve(__dirname, '..', '..', '..', 'misc', 'Images with thumbnails');
const docsUtilDir = path.resolve(__dirname, '..', 'docs', 'util');
const srcUtilDir = path.resolve(__dirname, '..', 'src', 'util');

const japanFsJson = path.join(docsUtilDir, 'chonky_project.fs_map.json');
const picsFsJson = path.join(docsUtilDir, 'japan_pics.fs_map.json');
const demoFsJson = path.join(srcUtilDir, 'demo.fs_map.json');

const createFile = (id, name, parentId) => ({
    id,
    name,
    modDate: new Date(),
    parentId,
});

const createFolder = (id, name, parentId, childrenIds) => ({
    id,
    name,
    isDir: true,
    modDate: new Date(),
    parentId,
    childrenIds,
});

Promise.resolve()
    .then(() => Promise.all([
        prepareFsJson(chonkyProjectDir, japanFsJson, 'Chonky source code'),
        prepareFsJson(japanPicsDir, picsFsJson, 'Images with thumbnails'),
    ]))
    .then(results => {
        const {fileMap: picsFileMap, rootFolderId: picsFolderId} = results[0];
        const {fileMap: chonkyFileMap, rootFolderId: chonkyFolderId} = results[1];

        const rootId = 'my-root-id';
        const foreverFolderId = 'forever-id';
        const longNameFolderId = 'long-names-id';
        const emptyFolderId = 'empty-id';
        const nestedFolderId = 'nested-folder-0';

        // @ts-ignore
        const fileMap = {
            [rootId]: {
                id: rootId,
                name: 'Demo Folder',
                isDir: true,
                modDate: new Date(),
                childrenIds: [
                    chonkyFolderId, picsFolderId, foreverFolderId,
                    longNameFolderId, emptyFolderId, nestedFolderId,
                ],
            },
            [foreverFolderId]: createFolder(foreverFolderId, 'Files that load forever', rootId,
                ['bad-id-1', 'bad-id-2', 'bad-id-3', 'bad-id-3']),
            [emptyFolderId]: createFolder(emptyFolderId, 'Empty folder', rootId),
            ...chonkyFileMap,
            ...picsFileMap,
        };
        fileMap[chonkyFolderId].parentId = rootId;
        fileMap[picsFolderId].parentId = rootId;

        // Generate some long names
        const longNames = [
            'File with a short name.tiff',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus viverra mattis eleifend. In hac' +
            ' habitasse platea dictumst. Cras risus arcu, vehicula feugiat diam eget, accumsan vestibulum nibh.md',
            'Lorem.ipsum.dolor.sit.amet,consectetur.adipiscing.elit.Vivamus.viverra.mattis.eleifend.In.hac' +
            '.habitasse.platea.dictumst.Cras.risus.arcu,vehicula.feugiat.diam.eget,accumsan.vestibulum.nibh.mp3',
            'Lorem-ipsum-dolor-sit-amet-consectetur-adipiscing-elit-Vivamus-viverra-mattis-eleifend-In-hac' +
            '-habitasse-platea-dictumst-Cras-risus-arcu-vehicula-feugiat-diam-eget-accumsan-vestibulum-nibh.tar.gz',
            'LoremipsumdolorsitametconsecteturadipiscingelitVivamusviverramattiseleifendInhac' +
            'loremipsumdolorsitametconsecteturadipiscingelitVivamusviverramattiseleifendInhac' +
            'loremipsumdolorsitametconsecteturadipiscingelitVivamusviverramattiseleifendInhac' +
            'habitasseplateadictumstCrasrisusarcuvehiculafeugiatdiamegetaccumsanvestibulumnibh.wav',
        ];
        const longNameFileIds = [];
        for (let i = 0; i < longNames.length; ++i) {
            const id = `long-name-file-${i}`;
            longNameFileIds.push(id);
            fileMap[id] = createFile(id, longNames[i], longNameFolderId);
        }
        fileMap[longNameFolderId] = createFolder(longNameFolderId, 'Files with long names', rootId, longNameFileIds);

        // Generate nested folders
        const nestedFolderCount = 20;
        let nestedChild = {};
        for (let i = 0; i < nestedFolderCount; ++i) {
            const folderName = i === 0 ? 'Final folder' : `${i} nested folders`;
            const children = i === 0 ? [] : [nestedChild.id];
            nestedChild = createFolder(`nested-folder-${nestedFolderCount - i}`, folderName,
                `nested-folder-${nestedFolderCount - i - 1}`, children);
            fileMap[nestedChild.id] = nestedChild;
        }
        console.log(nestedChild);
        fileMap[nestedFolderId] = createFolder(nestedFolderId, `${nestedFolderCount} nested folders`,
            rootId, [nestedChild.id]);

        return fs.writeFile(demoFsJson, JSON.stringify({rootFolderId: rootId, fileMap}, null, 2));
    })
    .catch(console.error);


