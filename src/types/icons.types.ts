export enum ChonkyIconName {
    // Misc
    loading = 'loading',
    dropdown = 'dropdown',

    // File Actions: Drag & drop
    dndDragging = 'dndDragging',
    dndCanDrop = 'dndCanDrop',
    dndCannotDrop = 'dndCannotDrop',

    // File Actions: File operations
    openFiles = 'openFiles',
    openParentFolder = 'openParentFolder',
    search = 'search',

    // File Actions: Unsorted
    checkActive = 'checkActive',
    checkInactive = 'checkInactive',
    desc = 'desc',
    asc = 'asc',
    list = 'list',
    folder = 'folder',
    folderCreate = 'folderCreate',
    folderOpen = 'folderOpen',
    smallThumbnail = 'smallThumbnail',
    largeThumbnail = 'largeThumbnail',
    folderChainSeparator = 'folderChainSeparator',
    download = 'download',
    upload = 'upload',
    trash = 'trash',
    fallbackIcon = 'fallbackIcon',
    symlink = 'symlink',
    hidden = 'hidden',

    // File types
    file = 'file',
    license = 'license',
    code = 'code',
    config = 'config',
    model = 'model',
    database = 'database',
    text = 'text',
    archive = 'archive',
    csv = 'csv',
    image = 'image',
    pdf = 'pdf',
    word = 'word',
    video = 'video',
    info = 'info',
    key = 'key',
    lock = 'lock',
    music = 'music',
    flash = 'flash',
    terminal = 'terminal',
    authors = 'authors',
    adobe = 'adobe',
    git = 'git',
    linux = 'linux',
    windows = 'windows',
    nodejs = 'nodejs',
    php = 'php',
    python = 'python',
    ubuntu = 'ubuntu',
}

export interface FileIconData {
    icon: ChonkyIconName | string;
    colorCode: number;
}
