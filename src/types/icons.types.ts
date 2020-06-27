export enum ChonkyIconName {
    // Misc
    loading = 'loading',
    dropdown = 'dropdown',
    circle = 'circle',

    // File Actions: Drag & drop
    dndDragging = 'dndDragging',
    dndCanDrop = 'dndCanDrop',
    dndCannotDrop = 'dndCannotDrop',

    // File Actions: File operations
    openFiles = 'openFiles',
    openParentFolder = 'openParentFolder',
    copy = 'copy',
    search = 'search',
    selectAllFiles = 'selectAllFiles',
    clearSelection = 'clearSelection',

    // File Actions: Sorting & options
    sortAsc = 'sortAsc',
    sortDesc = 'sortDesc',
    checkActive = 'checkActive',
    checkInactive = 'checkInactive',

    // File Actions: Unsorted
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

    // File modifiers
    symlink = 'symlink',
    hidden = 'hidden',

    // Generic file types
    file = 'file',
    license = 'license',
    code = 'code',
    config = 'config',
    model = 'model',
    database = 'database',
    text = 'text',
    archive = 'archive',
    image = 'image',
    video = 'video',
    info = 'info',
    key = 'key',
    lock = 'lock',
    music = 'music',
    terminal = 'terminal',
    users = 'users',

    // OS file types
    linux = 'linux',
    ubuntu = 'ubuntu',
    windows = 'windows',

    // Programming language file types
    rust = 'rust',
    python = 'python',
    nodejs = 'nodejs',
    php = 'php',

    // Development tools file types
    git = 'git',

    // Brands file types
    adobe = 'adobe',

    // Other program file types
    pdf = 'pdf',
    excel = 'excel',
    word = 'word',
    flash = 'flash',
}

export interface FileIconData {
    icon: ChonkyIconName | string;
    colorCode: number;
}
