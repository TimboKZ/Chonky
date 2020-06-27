[chonky](../README.md) › [Globals](../globals.md) › ["components/internal/HotkeyListener"](_components_internal_hotkeylistener_.md)

# Module: "components/internal/HotkeyListener"

## Index

### Interfaces

* [HotkeyListenerProps](../interfaces/_components_internal_hotkeylistener_.hotkeylistenerprops.md)

### Variables

* [HotkeyListener](_components_internal_hotkeylistener_.md#const-hotkeylistener)

## Variables

### `Const` HotkeyListener

• **HotkeyListener**: *React.FC‹[HotkeyListenerProps](../interfaces/_components_internal_hotkeylistener_.hotkeylistenerprops.md)›* = React.memo((props) => {
    const { fileActionId } = props;

    const fileAction = useRecoilValue(fileActionDataState(fileActionId));
    const requestFileAction = useRecoilValue(requestFileActionState);

    useEffect(() => {
        if (!fileAction || !fileAction.hotkeys || fileAction.hotkeys.length === 0) {
            return;
        }

        const hotkeysStr = fileAction.hotkeys.join(',');
        const hotkeyCallback = (event: KeyboardEvent) => {
            event.preventDefault();
            requestFileAction(fileAction.id);
        };
        hotkeys(hotkeysStr, hotkeyCallback);
        return () => hotkeys.unbind(hotkeysStr, hotkeyCallback);
    }, [fileAction, requestFileAction]);

    return null;
})

*Defined in [src/components/internal/HotkeyListener.tsx:20](https://github.com/TimboKZ/Chonky/blob/5b9fbdf/src/components/internal/HotkeyListener.tsx#L20)*
