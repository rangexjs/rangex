# @rangex/solid

SolidJS bindings for [`@rangex/editor`](https://www.npmjs.com/package/@rangex/editor). It turns the state of the editor's public ports into Solid accessors.

It extends `@rangex/editor`, it doesn't replace it: you create the editor and call its actions with `@rangex/editor`, and read its state reactively with this package. It contains no UI components; for a ready-made editor UI, use [`@rangex/rich-text-editor`](https://www.npmjs.com/package/@rangex/rich-text-editor).

## Install

```bash
npm install @rangex/solid
```

## Reactive ports

Each editor adapter has a matching factory with the same name. Pass it the adapter's public port and it returns the port's state as accessors. Actions stay on the public port.

```tsx
import type { RangeXEditor } from "@rangex/editor";
import { UndoRedo } from "@rangex/solid";

export const UndoButton = (props: { editor: RangeXEditor }) => {
	const undoRedo = props.editor.undoRedo;

	if (!undoRedo) {
		throw new Error("The UndoRedo adapter isn't enabled.");
	}

	const $undoRedo = UndoRedo(undoRedo);

	return (
		<button
			type="button"
			disabled={!$undoRedo.canStepBack()}
			onClick={() => undoRedo.stepBack()}
		>
			Undo
		</button>
	);
};
```

- **Call factories inside a component.** They subscribe to the editor and unsubscribe when the component is disposed.
- **Disabled adapters pass through.** If the adapter isn't enabled, its port is `undefined` and so is the factory's result.
- **Formatting** has one factory per format (`Bold`, `Italic`, `FontSize`, …) instead of a single port.

## Utilities

- `FloatingPortal` renders its children into the editor's floating container, for menus and popovers that position themselves over the content.

## License

MIT. RangeX depends on `@rangex/core`, which is licensed separately. See [LICENSE.md](https://github.com/rangexjs/rangex/blob/main/LICENSE.md).
