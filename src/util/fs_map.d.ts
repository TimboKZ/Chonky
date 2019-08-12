import {FileData} from '../types/FileData';

declare module '*.fs_map.json' {
    const fsMap: {
        fileMap: { [id: string]: FileData };
        rootFolderId: string;
    };
    export default fsMap;
}
