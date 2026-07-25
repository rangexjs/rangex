import type {
	CreateOverlayMountParams,
	EditorOverlayMount,
	OverlayMount,
	UIOverlayMount,
} from "./OverlayMount-types";

/**
 * Wraps one `OverlayHost.mount()` call with idempotent mount/unmount — `mount()` no-ops if
 * already mounted, `unmount()` no-ops if not. An Adapter that owns its own overlay (e.g.
 * `MentionAdapter`, `LinkAdapter`) assigns `uiOverlayMount`/`editorOverlayMount` to a named field
 * on its `uiPort`/`editorPort` (e.g. `popover`) — never flattened onto the port directly, so an
 * Adapter that ends up owning more than one overlay can just add another differently-named field.
 */
export const createOverlayMount = <Props extends object>({
	overlayHost,
	component,
	props,
}: CreateOverlayMountParams<Props>): OverlayMount => {
	let element: HTMLDivElement | null = null;
	let localUnmount: (() => void) | null = null;

	const uiOverlayMount: UIOverlayMount = {
		setElement: (popoverElement) => {
			element = popoverElement;
		},
	};

	const editorOverlayMount: EditorOverlayMount = {
		get element() {
			if (!element) {
				throw new Error("Popover wasn't set.");
			}

			return element;
		},

		get isMounted() {
			return !!element;
		},

		mount: () => {
			if (localUnmount) {
				return;
			}

			const { unmount } = overlayHost.mount({ component, props });

			localUnmount = unmount;
		},

		unmount: () => {
			localUnmount?.();
			localUnmount = null;
			element = null;
		},
	};

	return { uiOverlayMount, editorOverlayMount };
};
