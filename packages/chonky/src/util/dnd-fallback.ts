import { useCallback, useContext } from 'react';
import { DndContext, useDrag, useDrop } from 'react-dnd';

export const useDndContextAvailable = () => {
  const dndContext = useContext(DndContext);
  const { dragDropManager } = dndContext;
  return !!dragDropManager;
};

export const useDragIfAvailable: typeof useDrag = (...args) => {
  // This is an ugly hack to make `useDrag` not throw if a `DndContext` is not available.
  // See: https://github.com/react-dnd/react-dnd/issues/2212
  const dndContextAvailable = useDndContextAvailable();
  const mockHook = useCallback(() => [{} as any, () => null, () => null], []);
  // @ts-ignore
  const useHook: typeof useDrag = dndContextAvailable ? useDrag : mockHook;
  return useHook(...args);
};

export const useDropIfAvailable: typeof useDrop = (...args) => {
  const dndContextAvailable = useDndContextAvailable();
  const mockHook = useCallback(() => [{} as any, () => null], []);
  // @ts-ignore
  const useHook: typeof useDrop = dndContextAvailable ? useDrop : mockHook;
  return useHook(...args);
};
