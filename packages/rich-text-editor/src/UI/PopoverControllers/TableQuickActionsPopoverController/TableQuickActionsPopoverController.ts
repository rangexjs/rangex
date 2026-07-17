import { assertNever } from "../../ErrorHandling";
import type {
	TableQuickActionsCellResizingAction,
	TableQuickActionsCellResizingState,
	TableQuickActionsCellTypeAction,
	TableQuickActionsCellTypeState,
	TableQuickActionsClearContentsState,
	TableQuickActionsInsertDeleteAction,
	TableQuickActionsInsertDeleteState,
	TableQuickActionsListenerOption,
	TableQuickActionsMergeSplitAction,
	TableQuickActionsMergeSplitState,
	TableQuickActionsOnCellResizingFn,
	TableQuickActionsOnCellTypeFn,
	TableQuickActionsOnClearContentsFn,
	TableQuickActionsOnInsertDeleteFn,
	TableQuickActionsOnMergeSplitFn,
	TableQuickActionsOnSectionTypeFn,
	TableQuickActionsOnVerticalAlignmentFn,
	TableQuickActionsPopover,
	TableQuickActionsSectionTypeAction,
	TableQuickActionsSectionTypeState,
	TableQuickActionsUpdateCellResizingFn,
	TableQuickActionsUpdateCellTypeFn,
	TableQuickActionsUpdateClearContentsFn,
	TableQuickActionsUpdateInsertDeleteFn,
	TableQuickActionsUpdateListenerParams,
	TableQuickActionsUpdateMergeSplitFn,
	TableQuickActionsUpdateSectionTypeFn,
	TableQuickActionsUpdateVerticalAlignmentFn,
	TableQuickActionsVerticalAlignmentAction,
	TableQuickActionsVerticalAlignmentState,
	UpdateTableQuickActionsStateParams,
} from "./TableQuickActionsPopoverController-types";

export class TableQuickActionsPopoverController {
	#popover: HTMLDivElement | null = null;

	#sectionType: TableQuickActionsSectionTypeState = {
		header: { disabled: true },
		body: { disabled: true },
		footer: { disabled: true },
	};

	#mergeSplit: TableQuickActionsMergeSplitState = {
		mergeSelected: { disabled: true },
		mergeUp: { disabled: true },
		mergeDown: { disabled: true },
		mergeLeft: { disabled: true },
		mergeRight: { disabled: true },
		splitHorizontally: { disabled: true },
		splitVertically: { disabled: true },
		splitFully: { disabled: true },
	};

	#insertDelete: TableQuickActionsInsertDeleteState = {
		insertRowAbove: { disabled: true },
		insertRowBelow: { disabled: true },
		insertColumnLeft: { disabled: true },
		insertColumnRight: { disabled: true },
		deleteRow: { disabled: true },
		deleteColumn: { disabled: true },
	};

	#cellType: TableQuickActionsCellTypeState = {
		header: { disabled: true },
		data: { disabled: true },
	};

	#verticalAlignment: TableQuickActionsVerticalAlignmentState = {
		top: { disabled: true },
		middle: { disabled: true },
		bottom: { disabled: true },
	};

	#cellResizing: TableQuickActionsCellResizingState = {
		equalizeColumns: { disabled: true },
		minimizeRows: { disabled: true },
	};

	#clearContents: TableQuickActionsClearContentsState = { disabled: true };

	#sectionTypeListeners: Set<TableQuickActionsUpdateSectionTypeFn> = new Set();
	#mergeSplitListeners: Set<TableQuickActionsUpdateMergeSplitFn> = new Set();
	#insertDeleteListeners: Set<TableQuickActionsUpdateInsertDeleteFn> =
		new Set();
	#cellTypeListeners: Set<TableQuickActionsUpdateCellTypeFn> = new Set();
	#verticalAlignmentListeners: Set<TableQuickActionsUpdateVerticalAlignmentFn> =
		new Set();
	#cellResizingListeners: Set<TableQuickActionsUpdateCellResizingFn> =
		new Set();
	#clearContentsListeners: Set<TableQuickActionsUpdateClearContentsFn> =
		new Set();

	#onSectionTypeListeners: Set<TableQuickActionsOnSectionTypeFn> = new Set();
	#onMergeSplitListeners: Set<TableQuickActionsOnMergeSplitFn> = new Set();
	#onInsertDeleteListeners: Set<TableQuickActionsOnInsertDeleteFn> = new Set();
	#onCellTypeListeners: Set<TableQuickActionsOnCellTypeFn> = new Set();
	#onVerticalAlignmentListeners: Set<TableQuickActionsOnVerticalAlignmentFn> =
		new Set();
	#onCellResizingListeners: Set<TableQuickActionsOnCellResizingFn> = new Set();
	#onClearContentsListeners: Set<TableQuickActionsOnClearContentsFn> =
		new Set();

	get sectionType() {
		return this.#sectionType;
	}

	get mergeSplit() {
		return this.#mergeSplit;
	}

	get insertDelete() {
		return this.#insertDelete;
	}

	get cellType() {
		return this.#cellType;
	}

	get verticalAlignment() {
		return this.#verticalAlignment;
	}

	get cellResizing() {
		return this.#cellResizing;
	}

	get clearContents() {
		return this.#clearContents;
	}

	#updateListener({
		type,
		callback,
		operation,
	}: TableQuickActionsUpdateListenerParams) {
		if (type === "sectionType") {
			this.#sectionTypeListeners[operation](callback);
			return;
		}

		if (type === "mergeSplit") {
			this.#mergeSplitListeners[operation](callback);
			return;
		}

		if (type === "insertDelete") {
			this.#insertDeleteListeners[operation](callback);
			return;
		}

		if (type === "cellType") {
			this.#cellTypeListeners[operation](callback);
			return;
		}

		if (type === "verticalAlignment") {
			this.#verticalAlignmentListeners[operation](callback);
			return;
		}

		if (type === "cellResizing") {
			this.#cellResizingListeners[operation](callback);
			return;
		}

		if (type === "clearContents") {
			this.#clearContentsListeners[operation](callback);
			return;
		}

		assertNever(type);
	}

	subscribe(params: TableQuickActionsListenerOption) {
		this.#updateListener({ ...params, operation: "add" });
	}

	unsubscribe(params: TableQuickActionsListenerOption) {
		this.#updateListener({ ...params, operation: "delete" });
	}

	emitSectionType(action: TableQuickActionsSectionTypeAction) {
		for (const listener of this.#onSectionTypeListeners) {
			listener(action);
		}
	}

	emitMergeSplit(action: TableQuickActionsMergeSplitAction) {
		for (const listener of this.#onMergeSplitListeners) {
			listener(action);
		}
	}

	emitInsertDelete(action: TableQuickActionsInsertDeleteAction) {
		for (const listener of this.#onInsertDeleteListeners) {
			listener(action);
		}
	}

	emitCellType(action: TableQuickActionsCellTypeAction) {
		for (const listener of this.#onCellTypeListeners) {
			listener(action);
		}
	}

	emitVerticalAlignment(action: TableQuickActionsVerticalAlignmentAction) {
		for (const listener of this.#onVerticalAlignmentListeners) {
			listener(action);
		}
	}

	emitCellResizing(action: TableQuickActionsCellResizingAction) {
		for (const listener of this.#onCellResizingListeners) {
			listener(action);
		}
	}

	emitClearContents() {
		for (const listener of this.#onClearContentsListeners) {
			listener();
		}
	}

	updateState({
		sectionType,
		mergeSplit,
		insertDelete,
		cellType,
		verticalAlignment,
		cellResizing,
		clearContents,
	}: UpdateTableQuickActionsStateParams) {
		if (sectionType) {
			this.#sectionType = sectionType;

			for (const listener of this.#sectionTypeListeners) {
				listener(this.#sectionType);
			}
		}

		if (mergeSplit) {
			this.#mergeSplit = mergeSplit;

			for (const listener of this.#mergeSplitListeners) {
				listener(this.#mergeSplit);
			}
		}

		if (insertDelete) {
			this.#insertDelete = insertDelete;

			for (const listener of this.#insertDeleteListeners) {
				listener(this.#insertDelete);
			}
		}

		if (cellType) {
			this.#cellType = cellType;

			for (const listener of this.#cellTypeListeners) {
				listener(this.#cellType);
			}
		}

		if (verticalAlignment) {
			this.#verticalAlignment = verticalAlignment;

			for (const listener of this.#verticalAlignmentListeners) {
				listener(this.#verticalAlignment);
			}
		}

		if (cellResizing) {
			this.#cellResizing = cellResizing;

			for (const listener of this.#cellResizingListeners) {
				listener(this.#cellResizing);
			}
		}

		if (clearContents) {
			this.#clearContents = clearContents;

			for (const listener of this.#clearContentsListeners) {
				listener(this.#clearContents);
			}
		}
	}

	setPopover(element: HTMLDivElement) {
		this.#popover = element;
	}

	get publicAPI(): TableQuickActionsPopover {
		const controller = this;

		return {
			get popover() {
				if (!controller.#popover) {
					throw new Error("PopoverNode shouldn't be null.");
				}

				return controller.#popover;
			},

			updateState: (params) => this.updateState(params),

			onSectionType: (callback) => {
				this.#onSectionTypeListeners.add(callback);
				return () => this.#onSectionTypeListeners.delete(callback);
			},

			onMergeSplit: (callback) => {
				this.#onMergeSplitListeners.add(callback);
				return () => this.#onMergeSplitListeners.delete(callback);
			},

			onInsertDelete: (callback) => {
				this.#onInsertDeleteListeners.add(callback);
				return () => this.#onInsertDeleteListeners.delete(callback);
			},

			onCellType: (callback) => {
				this.#onCellTypeListeners.add(callback);
				return () => this.#onCellTypeListeners.delete(callback);
			},

			onVerticalAlignment: (callback) => {
				this.#onVerticalAlignmentListeners.add(callback);
				return () => this.#onVerticalAlignmentListeners.delete(callback);
			},

			onCellResizing: (callback) => {
				this.#onCellResizingListeners.add(callback);
				return () => this.#onCellResizingListeners.delete(callback);
			},

			onClearContents: (callback) => {
				this.#onClearContentsListeners.add(callback);
				return () => this.#onClearContentsListeners.delete(callback);
			},
		};
	}
}
