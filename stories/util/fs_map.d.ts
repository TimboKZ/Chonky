import {FileData} from '../../src/typedef';

declare module '*.fs_map.json' {
    const fsMap: {
        fileMap: { [id: string]: FileData },
        rootFolderId: string
    };
    export default fsMap;
}
