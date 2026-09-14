import { extendObjectProperties } from "#utilities";
import type {
	CreateTableAdapterParams,
	CreateTableAdapterResult,
	OnCanInsertUpdateCallbackFn,
	OnCellResizingUpdateCallbackFn,
	OnCellTypeUpdateCallbackFn,
	OnChangeCellResizingCallbackFn,
	OnChangeCellTypeCallbackFn,
	OnChangeInsertDeleteCallbackFn,
	OnChangeMergeSplitCallbackFn,
	OnChangeSectionTypeCallbackFn,
	OnChangeVerticalAlignmentCallbackFn,
	OnClearContentsCallbackFn,
	OnClearContentsUpdateCallbackFn,
	OnContextMenuToggleCallbackFn,
	OnInsertCallbackFn,
	OnInsertDeleteUpdateCallbackFn,
	OnMergeSplitUpdateCallbackFn,
	OnSectionTypeUpdateCallbackFn,
	OnVerticalAlignmentUpdateCallbackFn,
	TableConfigPort,
	TableConfigPortProps,
	TableInternals,
	TablePublicPort,
	TablePublicPortProps,
	UpdateStateParams,
} from "./TableAdapter-types";

export const createTableAdapter = (
	...params: CreateTableAdapterParams
): CreateTableAdapterResult => {
	const [_settings, { floatingContainer }] = params;

	const contextMenuEl = document.createElement("div");
	floatingContainer.append(contextMenuEl);

	const internals: TableInternals = {
		// States
		canInsert: false,
		sectionType: {
			header: { disabled: true },
			body: { disabled: true },
			footer: { disabled: true },
		},
		mergeSplit: {
			mergeSelected: { disabled: true },
			mergeUp: { disabled: true },
			mergeDown: { disabled: true },
			mergeLeft: { disabled: true },
			mergeRight: { disabled: true },
			splitHorizontally: { disabled: true },
			splitVertically: { disabled: true },
			splitFully: { disabled: true },
		},
		insertDelete: {
			insertRowAbove: { disabled: true },
			insertRowBelow: { disabled: true },
			insertColumnLeft: { disabled: true },
			insertColumnRight: { disabled: true },
			deleteRow: { disabled: true },
			deleteColumn: { disabled: true },
		},
		cellType: {
			header: { disabled: true },
			data: { disabled: true },
		},
		verticalAlignment: {
			top: { disabled: true },
			middle: { disabled: true },
			bottom: { disabled: true },
		},
		cellResizing: {
			equalizeColumns: { disabled: true },
			minimizeRows: { disabled: true },
		},
		clearContents: { disabled: true },
		// Rest
		contextMenuOpen: false,
	};

	// StateListeners
	const onCanInsertUpdateListeners: Set<OnCanInsertUpdateCallbackFn> =
		new Set();
	const onSectionTypeUpdateListeners: Set<OnSectionTypeUpdateCallbackFn> =
		new Set();
	const onMergeSplitUpdateListeners: Set<OnMergeSplitUpdateCallbackFn> =
		new Set();
	const onInsertDeleteUpdateListeners: Set<OnInsertDeleteUpdateCallbackFn> =
		new Set();
	const onCellTypeUpdateListeners: Set<OnCellTypeUpdateCallbackFn> = new Set();
	const onVerticalAlignmentUpdateListeners: Set<OnVerticalAlignmentUpdateCallbackFn> =
		new Set();
	const onCellResizingUpdateListeners: Set<OnCellResizingUpdateCallbackFn> =
		new Set();
	const onClearContentsUpdateListeners: Set<OnClearContentsUpdateCallbackFn> =
		new Set();

	// CommandListeners
	const onInsertListeners: Set<OnInsertCallbackFn> = new Set();
	const onChangeSectionTypeListeners: Set<OnChangeSectionTypeCallbackFn> =
		new Set();
	const onChangeMergeSplitListeners: Set<OnChangeMergeSplitCallbackFn> =
		new Set();
	const onChangeInsertDeleteListeners: Set<OnChangeInsertDeleteCallbackFn> =
		new Set();
	const onChangeCellTypeListeners: Set<OnChangeCellTypeCallbackFn> = new Set();
	const onChangeVerticalAlignmentListeners: Set<OnChangeVerticalAlignmentCallbackFn> =
		new Set();
	const onChangeCellResizingListeners: Set<OnChangeCellResizingCallbackFn> =
		new Set();
	const onClearContentsListeners: Set<OnClearContentsCallbackFn> = new Set();
	const onContextMenuToggleListeners: Set<OnContextMenuToggleCallbackFn> =
		new Set();

	const updateState = ({
		canInsert,
		contextMenuOpen,
		sectionType,
		mergeSplit,
		insertDelete,
		cellType,
		verticalAlignment,
		cellResizing,
		clearContents,
	}: UpdateStateParams) => {
		if (canInsert !== undefined) {
			internals.canInsert = canInsert;

			for (const listener of onCanInsertUpdateListeners) {
				listener(internals.canInsert);
			}
		}

		if (sectionType !== undefined) {
			internals.sectionType = sectionType;

			for (const listener of onSectionTypeUpdateListeners) {
				listener(internals.sectionType);
			}
		}

		if (mergeSplit !== undefined) {
			internals.mergeSplit = mergeSplit;

			for (const listener of onMergeSplitUpdateListeners) {
				listener(internals.mergeSplit);
			}
		}

		if (insertDelete !== undefined) {
			internals.insertDelete = insertDelete;

			for (const listener of onInsertDeleteUpdateListeners) {
				listener(internals.insertDelete);
			}
		}

		if (cellType !== undefined) {
			internals.cellType = cellType;

			for (const listener of onCellTypeUpdateListeners) {
				listener(internals.cellType);
			}
		}

		if (verticalAlignment !== undefined) {
			internals.verticalAlignment = verticalAlignment;

			for (const listener of onVerticalAlignmentUpdateListeners) {
				listener(internals.verticalAlignment);
			}
		}

		if (cellResizing !== undefined) {
			internals.cellResizing = cellResizing;

			for (const listener of onCellResizingUpdateListeners) {
				listener(internals.cellResizing);
			}
		}

		if (clearContents !== undefined) {
			internals.clearContents = clearContents;

			for (const listener of onClearContentsUpdateListeners) {
				listener(internals.clearContents);
			}
		}

		if (contextMenuOpen !== undefined) {
			internals.contextMenuOpen = contextMenuOpen;

			for (const listener of onContextMenuToggleListeners) {
				listener();
			}
		}
	};

	const configPort: TableConfigPort = extendObjectProperties({}, {
		get contextMenuEl() {
			return contextMenuEl;
		},

		updateState(params) {
			updateState(params);
		},

		setContextMenu({ open }) {
			updateState({ contextMenuOpen: open });
		},

		onInsert(callback) {
			onInsertListeners.add(callback);
			return () => onInsertListeners.delete(callback);
		},

		onChangeSectionType(callback) {
			onChangeSectionTypeListeners.add(callback);
			return () => onChangeSectionTypeListeners.delete(callback);
		},

		onChangeMergeSplit(callback) {
			onChangeMergeSplitListeners.add(callback);
			return () => onChangeMergeSplitListeners.delete(callback);
		},

		onChangeInsertDelete(callback) {
			onChangeInsertDeleteListeners.add(callback);
			return () => onChangeInsertDeleteListeners.delete(callback);
		},

		onChangeCellType(callback) {
			onChangeCellTypeListeners.add(callback);
			return () => onChangeCellTypeListeners.delete(callback);
		},

		onChangeVerticalAlignment(callback) {
			onChangeVerticalAlignmentListeners.add(callback);
			return () => onChangeVerticalAlignmentListeners.delete(callback);
		},

		onChangeCellResizing(callback) {
			onChangeCellResizingListeners.add(callback);
			return () => onChangeCellResizingListeners.delete(callback);
		},

		onClear(callback) {
			onClearContentsListeners.add(callback);
			return () => onClearContentsListeners.delete(callback);
		},
	} satisfies TableConfigPortProps);

	const publicPort: TablePublicPort = extendObjectProperties({}, {
		get contextMenuEl() {
			return contextMenuEl;
		},

		get canInsert() {
			return internals.canInsert;
		},

		get contextMenuOpen() {
			return internals.contextMenuOpen;
		},

		get sectionType() {
			return internals.sectionType;
		},

		get mergeSplit() {
			return internals.mergeSplit;
		},

		get insertDelete() {
			return internals.insertDelete;
		},

		get cellType() {
			return internals.cellType;
		},

		get verticalAlignment() {
			return internals.verticalAlignment;
		},

		get cellResizing() {
			return internals.cellResizing;
		},

		get clearContents() {
			return internals.clearContents;
		},

		onCanInsertUpdate(callback) {
			onCanInsertUpdateListeners.add(callback);
			return () => onCanInsertUpdateListeners.delete(callback);
		},

		onContextMenuToggle(callback) {
			onContextMenuToggleListeners.add(callback);
			return () => onContextMenuToggleListeners.delete(callback);
		},

		onSectionTypeUpdate(callback) {
			onSectionTypeUpdateListeners.add(callback);
			return () => onSectionTypeUpdateListeners.delete(callback);
		},

		onMergeSplitUpdate(callback) {
			onMergeSplitUpdateListeners.add(callback);
			return () => onMergeSplitUpdateListeners.delete(callback);
		},

		onInsertDeleteUpdate(callback) {
			onInsertDeleteUpdateListeners.add(callback);
			return () => onInsertDeleteUpdateListeners.delete(callback);
		},

		onCellTypeUpdate(callback) {
			onCellTypeUpdateListeners.add(callback);
			return () => onCellTypeUpdateListeners.delete(callback);
		},

		onVerticalAlignmentUpdate(callback) {
			onVerticalAlignmentUpdateListeners.add(callback);
			return () => onVerticalAlignmentUpdateListeners.delete(callback);
		},

		onCellResizingUpdate(callback) {
			onCellResizingUpdateListeners.add(callback);
			return () => onCellResizingUpdateListeners.delete(callback);
		},

		onClearContentsUpdate(callback) {
			onClearContentsUpdateListeners.add(callback);
			return () => onClearContentsUpdateListeners.delete(callback);
		},

		insert(params) {
			for (const listener of onInsertListeners) {
				listener(params);
			}
		},

		changeSectionType(action) {
			for (const listener of onChangeSectionTypeListeners) {
				listener(action);
			}
		},

		changeMergeSplit(action) {
			for (const listener of onChangeMergeSplitListeners) {
				listener(action);
			}
		},

		changeInsertDelete(action) {
			for (const listener of onChangeInsertDeleteListeners) {
				listener(action);
			}
		},

		changeCellType(action) {
			for (const listener of onChangeCellTypeListeners) {
				listener(action);
			}
		},

		changeVerticalAlignment(action) {
			for (const listener of onChangeVerticalAlignmentListeners) {
				listener(action);
			}
		},

		changeCellResizing(action) {
			for (const listener of onChangeCellResizingListeners) {
				listener(action);
			}
		},

		clear() {
			for (const listener of onClearContentsListeners) {
				listener();
			}
		},
	} satisfies TablePublicPortProps);

	return { configPort, publicPort };
};
