import { LineHandler } from "#ui-extensions";
import {
	createOverlayMount,
	type InsertRootLinePosition,
	type OnDeleteFn,
	type OnDuplicateFn,
	type OnInsertRootLineFn,
	type OverlayMount,
} from "../_Utilities";
import type {
	LineHandlerAdapterConstructorParams,
	LineHandlerEditorPort,
	LineHandlerUIPort,
	OnDragStartFn,
} from "./LineHandlerAdapter-types";

export class LineHandlerAdapter {
	#popoverOverlayMount: OverlayMount;

	#onDeleteListeners: Set<OnDeleteFn> = new Set();
	#onDuplicateListeners: Set<OnDuplicateFn> = new Set();
	#onInsertRootLineListeners: Set<OnInsertRootLineFn> = new Set();
	#onDragStartListeners: Set<OnDragStartFn> = new Set();

	#uiPort: LineHandlerUIPort | null = null;
	#editorPort: LineHandlerEditorPort | null = null;

	constructor(...params: LineHandlerAdapterConstructorParams) {
		const [_settings, { overlayHost }] = params;

		this.#popoverOverlayMount = createOverlayMount({
			overlayHost,
			component: LineHandler,
			props: { uiPort: this.uiPort },
		});
	}

	get uiPort(): LineHandlerUIPort {
		const adapter = this;

		this.#uiPort ??= {
			get popover() {
				return adapter.#popoverOverlayMount.uiOverlayMount;
			},

			emitDelete: () => {
				for (const listener of adapter.#onDeleteListeners) {
					listener();
				}
			},

			emitDuplicate: () => {
				for (const listener of adapter.#onDuplicateListeners) {
					listener();
				}
			},

			emitInsertRootLine: (position: InsertRootLinePosition) => {
				for (const listener of adapter.#onInsertRootLineListeners) {
					listener(position);
				}
			},

			emitDragStart: (dragEvent) => {
				for (const listener of adapter.#onDragStartListeners) {
					listener(dragEvent);
				}
			},
		};

		return this.#uiPort;
	}

	get editorPort(): LineHandlerEditorPort {
		const adapter = this;

		this.#editorPort ??= {
			get popover() {
				return adapter.#popoverOverlayMount.editorOverlayMount;
			},

			onDelete: (callback) => {
				adapter.#onDeleteListeners.add(callback);
				return () => adapter.#onDeleteListeners.delete(callback);
			},

			onDuplicate: (callback) => {
				adapter.#onDuplicateListeners.add(callback);
				return () => adapter.#onDuplicateListeners.delete(callback);
			},

			onInsertRootLine: (callback) => {
				adapter.#onInsertRootLineListeners.add(callback);
				return () => adapter.#onInsertRootLineListeners.delete(callback);
			},

			onDragStart: (callback) => {
				adapter.#onDragStartListeners.add(callback);
				return () => adapter.#onDragStartListeners.delete(callback);
			},
		};

		return this.#editorPort;
	}
}
