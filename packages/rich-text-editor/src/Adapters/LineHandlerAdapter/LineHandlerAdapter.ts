import { componentsName } from "#ports";
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
	OnCanDeleteUpdateFn,
	OnCanDuplicateUpdateFn,
	OnDragStartFn,
	OnTurnIntoFn,
	OnTurnIntoUpdateFn,
	TurnIntoAvailability,
	UpdateLineHandlerStateParams,
} from "./LineHandlerAdapter-types";

export class LineHandlerAdapter {
	#popoverOverlayMount: OverlayMount;

	#turnInto: TurnIntoAvailability = {
		[componentsName.accordionItem]: false,
		[componentsName.blockQuote]: false,
		[componentsName.codeBlock]: false,
		[componentsName.list]: false,
		[componentsName.todoList]: false,
	};
	#canDelete = true;
	#canDuplicate = true;

	#onDeleteListeners: Set<OnDeleteFn> = new Set();
	#onDuplicateListeners: Set<OnDuplicateFn> = new Set();
	#onInsertRootLineListeners: Set<OnInsertRootLineFn> = new Set();
	#onDragStartListeners: Set<OnDragStartFn> = new Set();
	#onTurnIntoListeners: Set<OnTurnIntoFn> = new Set();
	#turnIntoListeners: Set<OnTurnIntoUpdateFn> = new Set();
	#canDeleteListeners: Set<OnCanDeleteUpdateFn> = new Set();
	#canDuplicateListeners: Set<OnCanDuplicateUpdateFn> = new Set();

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

	#updateState({
		turnInto,
		canDelete,
		canDuplicate,
	}: UpdateLineHandlerStateParams) {
		if (turnInto !== undefined) {
			this.#turnInto = turnInto;

			for (const listener of this.#turnIntoListeners) {
				listener(turnInto);
			}
		}

		if (canDelete !== undefined) {
			this.#canDelete = canDelete;

			for (const listener of this.#canDeleteListeners) {
				listener(canDelete);
			}
		}

		if (canDuplicate !== undefined) {
			this.#canDuplicate = canDuplicate;

			for (const listener of this.#canDuplicateListeners) {
				listener(canDuplicate);
			}
		}
	}

	get uiPort(): LineHandlerUIPort {
		const adapter = this;

		this.#uiPort ??= {
			get popover() {
				return adapter.#popoverOverlayMount.uiOverlayMount;
			},

			get turnInto() {
				return adapter.#turnInto;
			},

			onTurnIntoUpdate: (callback) => {
				adapter.#turnIntoListeners.add(callback);
				return () => adapter.#turnIntoListeners.delete(callback);
			},

			get canDelete() {
				return adapter.#canDelete;
			},

			onCanDeleteUpdate: (callback) => {
				adapter.#canDeleteListeners.add(callback);
				return () => adapter.#canDeleteListeners.delete(callback);
			},

			get canDuplicate() {
				return adapter.#canDuplicate;
			},

			onCanDuplicateUpdate: (callback) => {
				adapter.#canDuplicateListeners.add(callback);
				return () => adapter.#canDuplicateListeners.delete(callback);
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

			emitTurnInto: (name) => {
				for (const listener of adapter.#onTurnIntoListeners) {
					listener(name);
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

			updateState: (params) => adapter.#updateState(params),

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

			onTurnInto: (callback) => {
				adapter.#onTurnIntoListeners.add(callback);
				return () => adapter.#onTurnIntoListeners.delete(callback);
			},
		};

		return this.#editorPort;
	}
}
