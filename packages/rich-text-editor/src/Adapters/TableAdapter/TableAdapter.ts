import { TableQuickActionsPopover } from "#ui-extensions";
import { createOverlayMount, type OverlayMount } from "../_Utilities";
import type {
	TableAdapterConstructorParams,
	TableCellResizingState,
	TableCellTypeState,
	TableClearContentsState,
	TableEditorPort,
	TableInsertDeleteState,
	TableMergeSplitState,
	TableOnCellResizingFn,
	TableOnCellTypeFn,
	TableOnClearContentsFn,
	TableOnInsertDeleteFn,
	TableOnInsertRequestFn,
	TableOnMergeSplitFn,
	TableOnSectionTypeFn,
	TableOnVerticalAlignmentFn,
	TableSectionTypeState,
	TableToolbarButtonState,
	TableUIPort,
	TableUpdateCellResizingFn,
	TableUpdateCellTypeFn,
	TableUpdateClearContentsFn,
	TableUpdateInsertDeleteFn,
	TableUpdateMergeSplitFn,
	TableUpdateSectionTypeFn,
	TableUpdateToolbarButtonFn,
	TableUpdateVerticalAlignmentFn,
	TableVerticalAlignmentState,
	UpdateTableStateParams,
} from "./TableAdapter-types";

export class TableAdapter {
	#overlayMount: OverlayMount;

	#toolbarButton: TableToolbarButtonState = { disabled: true };

	#sectionType: TableSectionTypeState = {
		header: { disabled: true },
		body: { disabled: true },
		footer: { disabled: true },
	};

	#mergeSplit: TableMergeSplitState = {
		mergeSelected: { disabled: true },
		mergeUp: { disabled: true },
		mergeDown: { disabled: true },
		mergeLeft: { disabled: true },
		mergeRight: { disabled: true },
		splitHorizontally: { disabled: true },
		splitVertically: { disabled: true },
		splitFully: { disabled: true },
	};

	#insertDelete: TableInsertDeleteState = {
		insertRowAbove: { disabled: true },
		insertRowBelow: { disabled: true },
		insertColumnLeft: { disabled: true },
		insertColumnRight: { disabled: true },
		deleteRow: { disabled: true },
		deleteColumn: { disabled: true },
	};

	#cellType: TableCellTypeState = {
		header: { disabled: true },
		data: { disabled: true },
	};

	#verticalAlignment: TableVerticalAlignmentState = {
		top: { disabled: true },
		middle: { disabled: true },
		bottom: { disabled: true },
	};

	#cellResizing: TableCellResizingState = {
		equalizeColumns: { disabled: true },
		minimizeRows: { disabled: true },
	};

	#clearContents: TableClearContentsState = { disabled: true };

	#toolbarButtonListeners: Set<TableUpdateToolbarButtonFn> = new Set();
	#sectionTypeListeners: Set<TableUpdateSectionTypeFn> = new Set();
	#mergeSplitListeners: Set<TableUpdateMergeSplitFn> = new Set();
	#insertDeleteListeners: Set<TableUpdateInsertDeleteFn> = new Set();
	#cellTypeListeners: Set<TableUpdateCellTypeFn> = new Set();
	#verticalAlignmentListeners: Set<TableUpdateVerticalAlignmentFn> = new Set();
	#cellResizingListeners: Set<TableUpdateCellResizingFn> = new Set();
	#clearContentsListeners: Set<TableUpdateClearContentsFn> = new Set();

	#onInsertRequestListeners: Set<TableOnInsertRequestFn> = new Set();
	#onSectionTypeListeners: Set<TableOnSectionTypeFn> = new Set();
	#onMergeSplitListeners: Set<TableOnMergeSplitFn> = new Set();
	#onInsertDeleteListeners: Set<TableOnInsertDeleteFn> = new Set();
	#onCellTypeListeners: Set<TableOnCellTypeFn> = new Set();
	#onVerticalAlignmentListeners: Set<TableOnVerticalAlignmentFn> = new Set();
	#onCellResizingListeners: Set<TableOnCellResizingFn> = new Set();
	#onClearContentsListeners: Set<TableOnClearContentsFn> = new Set();

	#uiPort: TableUIPort | null = null;
	#editorPort: TableEditorPort | null = null;

	constructor(...params: TableAdapterConstructorParams) {
		const [_settings, { overlayHost }] = params;

		this.#overlayMount = createOverlayMount({
			overlayHost,
			component: TableQuickActionsPopover,
			props: { uiPort: this.uiPort },
		});
	}

	#updateState({
		toolbarButton,
		sectionType,
		mergeSplit,
		insertDelete,
		cellType,
		verticalAlignment,
		cellResizing,
		clearContents,
	}: UpdateTableStateParams) {
		if (toolbarButton !== undefined) {
			this.#toolbarButton = toolbarButton;

			for (const listener of this.#toolbarButtonListeners) {
				listener(this.#toolbarButton);
			}
		}

		if (sectionType !== undefined) {
			this.#sectionType = sectionType;

			for (const listener of this.#sectionTypeListeners) {
				listener(this.#sectionType);
			}
		}

		if (mergeSplit !== undefined) {
			this.#mergeSplit = mergeSplit;

			for (const listener of this.#mergeSplitListeners) {
				listener(this.#mergeSplit);
			}
		}

		if (insertDelete !== undefined) {
			this.#insertDelete = insertDelete;

			for (const listener of this.#insertDeleteListeners) {
				listener(this.#insertDelete);
			}
		}

		if (cellType !== undefined) {
			this.#cellType = cellType;

			for (const listener of this.#cellTypeListeners) {
				listener(this.#cellType);
			}
		}

		if (verticalAlignment !== undefined) {
			this.#verticalAlignment = verticalAlignment;

			for (const listener of this.#verticalAlignmentListeners) {
				listener(this.#verticalAlignment);
			}
		}

		if (cellResizing !== undefined) {
			this.#cellResizing = cellResizing;

			for (const listener of this.#cellResizingListeners) {
				listener(this.#cellResizing);
			}
		}

		if (clearContents !== undefined) {
			this.#clearContents = clearContents;

			for (const listener of this.#clearContentsListeners) {
				listener(this.#clearContents);
			}
		}
	}

	get uiPort(): TableUIPort {
		const adapter = this;

		this.#uiPort ??= {
			get popover() {
				return adapter.#overlayMount.uiOverlayMount;
			},

			get toolbarButton() {
				return adapter.#toolbarButton;
			},

			get sectionType() {
				return adapter.#sectionType;
			},

			get mergeSplit() {
				return adapter.#mergeSplit;
			},

			get insertDelete() {
				return adapter.#insertDelete;
			},

			get cellType() {
				return adapter.#cellType;
			},

			get verticalAlignment() {
				return adapter.#verticalAlignment;
			},

			get cellResizing() {
				return adapter.#cellResizing;
			},

			get clearContents() {
				return adapter.#clearContents;
			},

			onToolbarButtonUpdate: (callback) => {
				adapter.#toolbarButtonListeners.add(callback);
				return () => adapter.#toolbarButtonListeners.delete(callback);
			},

			onSectionTypeUpdate: (callback) => {
				adapter.#sectionTypeListeners.add(callback);
				return () => adapter.#sectionTypeListeners.delete(callback);
			},

			onMergeSplitUpdate: (callback) => {
				adapter.#mergeSplitListeners.add(callback);
				return () => adapter.#mergeSplitListeners.delete(callback);
			},

			onInsertDeleteUpdate: (callback) => {
				adapter.#insertDeleteListeners.add(callback);
				return () => adapter.#insertDeleteListeners.delete(callback);
			},

			onCellTypeUpdate: (callback) => {
				adapter.#cellTypeListeners.add(callback);
				return () => adapter.#cellTypeListeners.delete(callback);
			},

			onVerticalAlignmentUpdate: (callback) => {
				adapter.#verticalAlignmentListeners.add(callback);
				return () => adapter.#verticalAlignmentListeners.delete(callback);
			},

			onCellResizingUpdate: (callback) => {
				adapter.#cellResizingListeners.add(callback);
				return () => adapter.#cellResizingListeners.delete(callback);
			},

			onClearContentsUpdate: (callback) => {
				adapter.#clearContentsListeners.add(callback);
				return () => adapter.#clearContentsListeners.delete(callback);
			},

			emitInsertRequest: (params) => {
				for (const listener of adapter.#onInsertRequestListeners) {
					listener(params);
				}
			},

			emitSectionType: (action) => {
				for (const listener of adapter.#onSectionTypeListeners) {
					listener(action);
				}
			},

			emitMergeSplit: (action) => {
				for (const listener of adapter.#onMergeSplitListeners) {
					listener(action);
				}
			},

			emitInsertDelete: (action) => {
				for (const listener of adapter.#onInsertDeleteListeners) {
					listener(action);
				}
			},

			emitCellType: (action) => {
				for (const listener of adapter.#onCellTypeListeners) {
					listener(action);
				}
			},

			emitVerticalAlignment: (action) => {
				for (const listener of adapter.#onVerticalAlignmentListeners) {
					listener(action);
				}
			},

			emitCellResizing: (action) => {
				for (const listener of adapter.#onCellResizingListeners) {
					listener(action);
				}
			},

			emitClearContents: () => {
				for (const listener of adapter.#onClearContentsListeners) {
					listener();
				}
			},
		};

		return this.#uiPort;
	}

	get editorPort(): TableEditorPort {
		const adapter = this;

		this.#editorPort ??= {
			get popover() {
				return adapter.#overlayMount.editorOverlayMount;
			},

			updateState: (params) => adapter.#updateState(params),

			onInsertRequest: (callback) => {
				adapter.#onInsertRequestListeners.add(callback);
				return () => adapter.#onInsertRequestListeners.delete(callback);
			},

			onSectionType: (callback) => {
				adapter.#onSectionTypeListeners.add(callback);
				return () => adapter.#onSectionTypeListeners.delete(callback);
			},

			onMergeSplit: (callback) => {
				adapter.#onMergeSplitListeners.add(callback);
				return () => adapter.#onMergeSplitListeners.delete(callback);
			},

			onInsertDelete: (callback) => {
				adapter.#onInsertDeleteListeners.add(callback);
				return () => adapter.#onInsertDeleteListeners.delete(callback);
			},

			onCellType: (callback) => {
				adapter.#onCellTypeListeners.add(callback);
				return () => adapter.#onCellTypeListeners.delete(callback);
			},

			onVerticalAlignment: (callback) => {
				adapter.#onVerticalAlignmentListeners.add(callback);
				return () => adapter.#onVerticalAlignmentListeners.delete(callback);
			},

			onCellResizing: (callback) => {
				adapter.#onCellResizingListeners.add(callback);
				return () => adapter.#onCellResizingListeners.delete(callback);
			},

			onClearContents: (callback) => {
				adapter.#onClearContentsListeners.add(callback);
				return () => adapter.#onClearContentsListeners.delete(callback);
			},
		};

		return this.#editorPort;
	}
}
