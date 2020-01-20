/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import React from 'react';
import { Nullable } from 'tsdef';
import classnames from 'classnames';
import { AutoSizer, CellMeasurer, CellMeasurerCache, Grid, List } from 'react-virtualized';

import FileListEntry, { FileListEntryProps } from './FileListEntry';
import { isMobileDevice, isNil, isNumber, isObject } from '../util/Util';
import { EntrySize, FileData, FileView, InternalClickHandler, Selection, ThumbnailGenerator } from '../typedef';
import { ConfigContext } from './ConfigContext';

interface FileListProps {
  files: Nullable<FileData>[];
  selection: Selection;

  // Action handlers and other functions
  doubleClickDelay: number;
  onFileSingleClick: InternalClickHandler;
  onFileDoubleClick: InternalClickHandler;
  thumbnailGenerator?: ThumbnailGenerator;

  // Options
  showRelativeDates: boolean;

  // View & sort settings
  fillParentContainer: boolean;
  view: FileView;
}

interface FileListState { }

const DefaultRowHeight = 35;
const DetailsRowParameters = {
  defaultHeight: DefaultRowHeight,
  minHeight: DefaultRowHeight,
  fixedWidth: true,
};
const determineThumbsSize = (() => {
  const SmallThumbsSize: EntrySize = { width: 200, height: 160 };
  const LargeThumbsSize: EntrySize = { width: 280, height: 220 };
  return (view: FileView) =>
    view === FileView.LargeThumbs ? LargeThumbsSize : SmallThumbsSize;
})();

export default class FileList extends React.PureComponent<
  FileListProps,
  FileListState
  > {
  private readonly detailsMeasureCache: CellMeasurerCache;
  private lastDetailsRenderWidth?: number;
  private readonly thumbsGridRef: React.Ref<Grid>;
  public static contextType = ConfigContext;
  public context!: React.ContextType<typeof ConfigContext>

  public constructor(props: FileListProps) {
    super(props);
    this.detailsMeasureCache = new CellMeasurerCache(DetailsRowParameters);
    this.thumbsGridRef = React.createRef<Grid>();
  }

  public componentDidUpdate(prevProps: Readonly<FileListProps>): void {
    const { view: oldView } = prevProps;
    const { view } = this.props;

    if (view !== oldView) {
      // @ts-ignore
      const current: Nullable<Grid> = this.thumbsGridRef.current;
      if (!isNil(current)) {
        current.recomputeGridSize();
      }
    }
  }

  private getColWidth = (
    index: number,
    columnCount: number,
    entrySize: EntrySize,
    gutterSize: number
  ) => {
    if (index === columnCount - 1) return entrySize.width;
    return entrySize.width + gutterSize;
  };

  private getRowHeight = (
    index: number,
    rowCount: number,
    entrySize: EntrySize,
    gutterSize: number
  ) => {
    if (index === rowCount - 1) return entrySize.height;
    return entrySize.height + gutterSize;
  };

  private entryRenderer = (
    virtualKey: string,
    index: number,
    style: any,
    parent: any,
    gutterSize?: number,
    lastRow?: boolean,
    lastColumn?: boolean
  ) => {
    const {
      files,
      selection,
      doubleClickDelay,
      onFileSingleClick,
      onFileDoubleClick,
      thumbnailGenerator,
      showRelativeDates,
      view,
    } = this.props;

    if (isNumber(gutterSize)) {
      if (lastRow !== true) style.height = style.height - gutterSize;
      if (lastColumn !== true) style.width = style.width - gutterSize;
    }

    if (index >= files.length) return null;
    const file = files[index];
    const key = isObject(file) ? file.id : `loading-file-${virtualKey}`;
    const selected = isObject(file) ? selection[file.id] === true : false;
    const entryProps: FileListEntryProps = {
      file,
      style,
      selected,
      displayIndex: index,
      doubleClickDelay,
      onFileSingleClick,
      onFileDoubleClick,
      thumbnailGenerator,
      showRelativeDates,
      view,
    };

    if (view === FileView.Details) {
      return (
        <CellMeasurer
          key={key}
          parent={parent}
          rowIndex={index}
          columnIndex={0}
          cache={this.detailsMeasureCache}
        >
          {({ measure }) => (
            <FileListEntry key={key} onMount={measure} {...entryProps} />
          )}
        </CellMeasurer>
      );
    }

    return <FileListEntry key={key} {...entryProps} />;
  };

  private noContentRenderer = (height?: number) => {
    const placeholderProps: any = {
      className: classnames({
        'chonky-file-list-notification': true,
        'chonky-file-list-notification-empty': true,
      }),
    };
    if (isNumber(height)) placeholderProps.style = { height };

    const { Icon, icons } = this.context;

    return (
      <div {...placeholderProps}>
        <div className="chonky-file-list-notification-content">
          <Icon icon={icons.folderOpen} />
          &nbsp; Nothing to show
        </div>
      </div>
    );
  };

  public render() {
    const { files, fillParentContainer, view } = this.props;

    const isThumbs =
      view === FileView.SmallThumbs || view === FileView.LargeThumbs;
    const className = classnames({
      'chonky-file-list': true,
      'chonky-file-list-thumbs': isThumbs,
      'chonky-file-list-thumbs-small':
        isThumbs && view === FileView.SmallThumbs,
      'chonky-file-list-thumbs-large':
        isThumbs && view === FileView.LargeThumbs,
      'chonky-file-list-details': !isThumbs,
    });

    const autoSizerProps: any = {};
    if (!fillParentContainer) autoSizerProps.disableHeight = true;

    return (
      <div className={className}>
        <AutoSizer {...autoSizerProps}>
          {({ width, height }) => {
            let rowCount: number;

            if (view === FileView.Details) {
              if (this.lastDetailsRenderWidth !== width) {
                this.lastDetailsRenderWidth = width;
                this.detailsMeasureCache.clearAll();
              }

              rowCount = files.length;
              return (
                <List
                  rowRenderer={data =>
                    this.entryRenderer(
                      data.key,
                      data.index,
                      data.style,
                      data.parent
                    )
                  }
                  noRowsRenderer={() =>
                    this.noContentRenderer(DefaultRowHeight)
                  }
                  deferredMeasurementCache={this.detailsMeasureCache}
                  rowCount={rowCount}
                  rowHeight={this.detailsMeasureCache.rowHeight}
                  width={width}
                  height={isNil(height) ? 500 : height}
                  autoHeight={!fillParentContainer}
                  tabIndex={null}
                />
              );
            }

            let columnCount: number;
            let entrySize = determineThumbsSize(view);

            const isMobile = isMobileDevice();
            const gutter = isMobile ? 5 : 10;
            const scrollbar = !fillParentContainer || isMobile ? 0 : 16;

            const isLargeThumbs = view === FileView.LargeThumbs;
            if (isMobile && width < 400) {
              // Hardcode column count on mobile
              columnCount = isLargeThumbs ? 2 : 3;
              entrySize = {
                width: Math.floor(
                  (width - gutter * (columnCount - 1)) / columnCount
                ),
                height: isLargeThumbs ? 160 : 120,
              };
            } else {
              const columnCountFloat =
                (width + gutter - scrollbar) / (entrySize.width + gutter);
              columnCount = Math.max(1, Math.floor(columnCountFloat));
            }
            rowCount = Math.ceil(files.length / columnCount);

            return (
              <Grid
                ref={this.thumbsGridRef}
                cellRenderer={data => {
                  const index = data.rowIndex * columnCount + data.columnIndex;
                  return this.entryRenderer(
                    data.key,
                    index,
                    { ...data.style },
                    data.parent,
                    gutter,
                    data.rowIndex === rowCount - 1,
                    data.columnIndex === columnCount - 1
                  );
                }}
                noContentRenderer={() =>
                  this.noContentRenderer(entrySize.height)
                }
                rowCount={rowCount}
                columnCount={columnCount}
                columnWidth={({ index }) =>
                  this.getColWidth(index, columnCount, entrySize, gutter)
                }
                rowHeight={({ index }) =>
                  this.getRowHeight(index, rowCount, entrySize, gutter)
                }
                width={width}
                height={isNil(height) ? 500 : height}
                autoHeight={!fillParentContainer}
                tabIndex={null}
              />
            );
          }}
        </AutoSizer>
      </div>
    );
  }
}
