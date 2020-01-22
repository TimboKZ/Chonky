import { useEffect, useReducer, useCallback } from 'react';
import {
  Selection,
  FileData,
  InputEvent,
  SelectionType,
  FileArray,
} from '../typedef';
import { Nullable } from 'tsdef';
import { isArray, isNumber } from 'util';
import {
  clampIndex,
  isObject,
  isNil,
  isMobileDevice,
  isFunction,
} from '../util/Util';
import ConsoleUtil from '../util/ConsoleUtil';
import { KbKey, Options, SortOrder } from '..';
import { usePrevious } from '../hooks/usePrevious';
import { shallowEqualArrays } from 'shallow-equal';

interface RenderProps {
  previousSelectionIndex?: number;
  selection: Selection;
  handleFileSingleClick: (
    file: FileData,
    event: InputEvent,
    displayIndex: number
  ) => void;
  setSelection: (
    selection: Selection,
    selectionIndex: number | undefined
  ) => void;
}

interface Props {
  children: (props: RenderProps) => any;
  files?: Nullable<FileData>[];
  disableSelection: boolean;
  folderChain: FileArray;
  onSelectionChange?: (selection: Selection) => void;
  options?: Options;
  sortProperty?: string | ((file: FileData) => any);
  sortOrder?: SortOrder;
}

type State = Pick<RenderProps, 'selection' | 'previousSelectionIndex'>;

interface FileSingleClickAction {
  type: 'file_single_click';
  files?: Nullable<FileData>[];
  file: FileData;
  displayIndex: number;
  event: InputEvent;
}

type Action =
  | {
      type: 'new_files';
      files?: Nullable<FileData>[];
    }
  | { type: 'new_folder_chain' }
  | { type: 'disable_selection' }
  | {
      type: 'set_selection';
      selection: Selection | undefined;
      selectionIndex: number | undefined;
    }
  | {
      type: 'new_sort';
      files?: Nullable<FileData>[];
    }
  | FileSingleClickAction
  | { type: 'key_press' };

const handleSelectionToggle = (
  action: FileSingleClickAction,
  state: State,
  type: SelectionType
): State => {
  const { selection: oldSelection = {}, previousSelectionIndex } = state;
  const { files = [] } = action;

  // Handle bulk selections
  if (type === SelectionType.All) {
    const count = Object.keys(oldSelection).length;
    if (count === files.length) return { selection: {} };

    const selection = {};
    for (const file of files) {
      if (isObject(file)) selection[file.id] = true;
    }
    return { selection, previousSelectionIndex };
  } else if (type === SelectionType.None) {
    return { selection: {}, previousSelectionIndex: undefined };
  }

  // If it's not a bulk selection, continue to Multiple or Range
  const { file, displayIndex } = action;

  if (isNil(file) || isNil(displayIndex)) {
    ConsoleUtil.warn(
      `Tried to toggle "${type}" selection without "file" or "displayIndex" specified!`
    );
    return { selection: oldSelection, previousSelectionIndex };
  }

  const prevIndex = isNumber(previousSelectionIndex)
    ? clampIndex(previousSelectionIndex as number, files)
    : null;

  if (type === SelectionType.Range && !isNumber(prevIndex)) {
    // Fallback to multiple selection if no previous index is available
    type = SelectionType.Multiple;
  }

  let selectionIndexToPersist = displayIndex;
  if (type == SelectionType.Multiple || type == SelectionType.Range) {
    if (isNumber(prevIndex)) selectionIndexToPersist = prevIndex as number;
  }

  let newSelection: Selection = {};
  const oldSelected = oldSelection[file.id];

  switch (type) {
    case SelectionType.Single:
      if (file.selectable !== false) {
        const selectionSize = Object.keys(oldSelection).length;
        if (oldSelected !== true || selectionSize > 1) {
          newSelection[file.id] = true;
        }
      }
      if (isNil(oldSelected) && file.selectable !== false)
        newSelection[file.id] = true;
      break;
    case SelectionType.Multiple:
      newSelection = { ...oldSelection };
      if (oldSelected === true) delete newSelection[file.id];
      else if (file.selectable !== false) newSelection[file.id] = true;
      break;
    case SelectionType.Range:
      let indexA = prevIndex as number;
      let indexB = displayIndex;
      if (indexA > indexB) [indexA, indexB] = [indexB, indexA];
      for (let i = indexA; i < indexB + 1; ++i) {
        const file = files[i];
        if (!isNil(file) && file.selectable !== false)
          newSelection[file.id] = true;
      }
      break;
  }

  return {
    selection: newSelection,
    previousSelectionIndex: selectionIndexToPersist,
  };
};

const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'new_files': {
      const {
        selection: oldSelection,
        previousSelectionIndex: prevIndex,
      } = state;
      if (isNil(oldSelection)) {
        return { selection: {}, previousSelectionIndex: undefined };
      }

      const { files } = action;

      const selection = {};
      let previousSelectionIndex = undefined;
      if (isArray(files)) {
        previousSelectionIndex = isNumber(prevIndex)
          ? clampIndex(prevIndex, files)
          : undefined;
        files.map(file => {
          if (!isObject(file)) return;
          const wasSelected = oldSelection[file.id] === true;
          const canBeSelected = file.selectable !== false;
          if (wasSelected && canBeSelected) selection[file.id] = true;
        });
      }

      return { selection, previousSelectionIndex };
    }
    case 'new_folder_chain':
      return { selection: {}, previousSelectionIndex: undefined };
    case 'disable_selection':
      return { selection: {}, previousSelectionIndex: undefined };
    case 'set_selection': {
      const { selection = {}, selectionIndex } = action;
      return { selection, previousSelectionIndex: selectionIndex };
    }
    case 'file_single_click': {
      const { event } = action;

      try {
        let type = isMobileDevice()
          ? SelectionType.Multiple
          : SelectionType.Single;
        if (event.ctrlKey || event.key === KbKey.Space)
          type = SelectionType.Multiple;
        if (event.shiftKey) type = SelectionType.Range;

        return handleSelectionToggle(action, state, type);
      } catch (error) {
        ConsoleUtil.logInternalException(error, 'handling selection toggle.');
      }
    }
    case 'new_sort': {
      const { files = [] } = action;
      const { selection } = state;

      const newSelection = {};
      for (const file of files) {
        if (isNil(file) || selection[file.id] !== true) continue;
        newSelection[file.id] = true;
      }

      return { selection: newSelection, previousSelectionIndex: undefined };
    }
    default:
      return state;
  }
};

export const SelectionController = ({
  children,
  files,
  disableSelection,
  folderChain,
  onSelectionChange,
  options,
  sortProperty,
  sortOrder,
}: Props) => {
  const prevFiles = usePrevious(files);
  const prevFolderChain = usePrevious(folderChain);

  const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, {
    previousSelectionIndex: undefined,
    selection: {},
  });

  const { previousSelectionIndex, selection } = state;

  useEffect(() => {
    if (isFunction(onSelectionChange)) onSelectionChange(selection);
  }, [selection]);

  useEffect(() => {
    dispatch({ type: 'disable_selection' });
  }, [disableSelection]);

  useEffect(() => {
    if (shallowEqualArrays(files, prevFiles)) return;
    dispatch({ type: 'new_files', files });
  }, [files]);

  useEffect(() => {
    if (shallowEqualArrays(folderChain, prevFolderChain)) return;
    dispatch({ type: 'new_folder_chain' });
  });

  useEffect(() => {
    dispatch({ type: 'new_sort', files });
  }, [options, sortProperty, sortOrder]);

  const handleFileSingleClick = useCallback<
    RenderProps['handleFileSingleClick']
  >(
    (file: FileData, event: InputEvent, displayIndex: number) => {
      dispatch({ type: 'file_single_click', files, file, event, displayIndex });
    },
    [files]
  );

  const setSelection: RenderProps['setSelection'] = (
    selection: Selection,
    selectionIndex: number | undefined
  ) => dispatch({ type: 'set_selection', selection, selectionIndex });

  return children({
    previousSelectionIndex,
    selection,
    handleFileSingleClick,
    setSelection,
  });
};
