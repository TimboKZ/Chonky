[chonky](../README.md) › [Globals](../globals.md) › ["components/internal/ErrorMessage"](_components_internal_errormessage_.md)

# Module: "components/internal/ErrorMessage"

## Index

### Interfaces

* [ErrorMessageProps](../interfaces/_components_internal_errormessage_.errormessageprops.md)

### Variables

* [ErrorMessage](_components_internal_errormessage_.md#const-errormessage)

## Variables

### `Const` ErrorMessage

• **ErrorMessage**: *NamedExoticComponent‹[ErrorMessageProps](../interfaces/_components_internal_errormessage_.errormessageprops.md)›* = React.memo<ErrorMessageProps>((props) => {
    const { message, bullets } = props;

    let bulletList = null;
    if (bullets && bullets.length > 0) {
        const items = [];
        for (let i = 0; i < bullets.length; ++i) {
            items.push(<li key={`error-bullet-${i}`}>{bullets[i]}</li>);
        }
        bulletList = <ul>{items}</ul>;
    }

    return (
        <div className="chonky-error">
            <span className="chonky-error-name">Chonky runtime error:</span> {message}
            {bulletList}
        </div>
    );
})

*Defined in [src/components/internal/ErrorMessage.tsx:8](https://github.com/TimboKZ/Chonky/blob/bceb265/src/components/internal/ErrorMessage.tsx#L8)*
