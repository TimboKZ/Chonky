Default icons are selected from [Font Awesome](https://fontawesome.com/) for controls and file types.  These icons can be customized in two different ways:

1. You can pass a map to override the default icons with alternatives from Font Awesome.  You'll need to install the Font Awesome package that contains your desired icon.

  ```bash
  npm install @fortawesome/free-brands-svg-icons
  ```

  Then, pass your map with overrides to `FileBrowser`.

  ```js
  import { faCodepen } from '@fortawesome/free-brands-svg-icons';

  <FileBrowser icons={{ code: faCodepen }}>
  ```

2. You can implement a whole new `Icon` component to render icons, that accepts icons from your custom map of icons.  Remember that by default, the map will contain Font Awesome ligatures.  Your `Icon` component should implement the following `IconProps` props, based on a subset of `FontAwesomeIcon`.

  ```typescript
  export interface IconProps {
    icon: any;
    spin?: boolean;
    className?: string;
    color?: string;
    fixedWidth?: boolean;
    size?: "xs" | "lg" | "sm";
    style?: CSSProperties;
  }
  ```

  You can then pass your icon component to the FileBrowser:

  ```javascript
  <FileBrowser icons={{ code: faCodepen }} Icon={MyIconComponent}>
  ```

  Your icon component will be called wherever an icon exists in the UI:

  ```javascript
  <Icon icon={icons.code} />
  ```

Available icons are:
- checkActive
- checkInactive
- desc
- asc
- list
- folder
- folderCreate
- folderOpen
- smallThumbnail
- largetThumbnail
- angleRight
- angleDown
- download
- upload
- trash
- directoryUp
- fallbackIcon
- symlink
- hidden
- loading
- file
- license
- code
- config
- model
- database
- text
- archive
- csv
- image
- pdf
- word
- video
- info
- key
- lock
- music
- flash
- terminal
- authors
- adobe
- git
- linux
- nodejs
- php
- python
- ubuntu