import type { BlockComponent } from "rich-text-area";
import { extendObjectProperties } from "#utilities";
import {
	createCurrentComponentPort,
	createEmitter,
	createUnwrapPort,
} from "../_Utilities";
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
	const [_settings, { adapterBus, floatingContainer }] = params;

	adapterBus.registerAdapter("table");

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
	const canInsertUpdateEmitter = createEmitter<OnCanInsertUpdateCallbackFn>();
	const sectionTypeUpdateEmitter =
		createEmitter<OnSectionTypeUpdateCallbackFn>();
	const mergeSplitUpdateEmitter = createEmitter<OnMergeSplitUpdateCallbackFn>();
	const insertDeleteUpdateEmitter =
		createEmitter<OnInsertDeleteUpdateCallbackFn>();
	const cellTypeUpdateEmitter = createEmitter<OnCellTypeUpdateCallbackFn>();
	const verticalAlignmentUpdateEmitter =
		createEmitter<OnVerticalAlignmentUpdateCallbackFn>();
	const cellResizingUpdateEmitter =
		createEmitter<OnCellResizingUpdateCallbackFn>();
	const clearContentsUpdateEmitter =
		createEmitter<OnClearContentsUpdateCallbackFn>();

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();
	const changeSectionTypeEmitter =
		createEmitter<OnChangeSectionTypeCallbackFn>();
	const changeMergeSplitEmitter = createEmitter<OnChangeMergeSplitCallbackFn>();
	const changeInsertDeleteEmitter =
		createEmitter<OnChangeInsertDeleteCallbackFn>();
	const changeCellTypeEmitter = createEmitter<OnChangeCellTypeCallbackFn>();
	const changeVerticalAlignmentEmitter =
		createEmitter<OnChangeVerticalAlignmentCallbackFn>();
	const changeCellResizingEmitter =
		createEmitter<OnChangeCellResizingCallbackFn>();
	const clearContentsEmitter = createEmitter<OnClearContentsCallbackFn>();
	const contextMenuToggleEmitter =
		createEmitter<OnContextMenuToggleCallbackFn>();

	const unwrapPort = createUnwrapPort();
	const currentComponentPort = createCurrentComponentPort<BlockComponent>();

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

			canInsertUpdateEmitter.emit(internals.canInsert);
		}

		if (sectionType !== undefined) {
			internals.sectionType = sectionType;

			sectionTypeUpdateEmitter.emit(internals.sectionType);
		}

		if (mergeSplit !== undefined) {
			internals.mergeSplit = mergeSplit;

			mergeSplitUpdateEmitter.emit(internals.mergeSplit);
		}

		if (insertDelete !== undefined) {
			internals.insertDelete = insertDelete;

			insertDeleteUpdateEmitter.emit(internals.insertDelete);
		}

		if (cellType !== undefined) {
			internals.cellType = cellType;

			cellTypeUpdateEmitter.emit(internals.cellType);
		}

		if (verticalAlignment !== undefined) {
			internals.verticalAlignment = verticalAlignment;

			verticalAlignmentUpdateEmitter.emit(internals.verticalAlignment);
		}

		if (cellResizing !== undefined) {
			internals.cellResizing = cellResizing;

			cellResizingUpdateEmitter.emit(internals.cellResizing);
		}

		if (clearContents !== undefined) {
			internals.clearContents = clearContents;

			clearContentsUpdateEmitter.emit(internals.clearContents);
		}

		if (contextMenuOpen !== undefined) {
			internals.contextMenuOpen = contextMenuOpen;

			contextMenuToggleEmitter.emit();
		}
	};

	const configPort: TableConfigPort = extendObjectProperties(
		unwrapPort.configPort,
		currentComponentPort.configPort,
		{
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
				return insertEmitter.subscribe(callback);
			},

			onChangeSectionType(callback) {
				return changeSectionTypeEmitter.subscribe(callback);
			},

			onChangeMergeSplit(callback) {
				return changeMergeSplitEmitter.subscribe(callback);
			},

			onChangeInsertDelete(callback) {
				return changeInsertDeleteEmitter.subscribe(callback);
			},

			onChangeCellType(callback) {
				return changeCellTypeEmitter.subscribe(callback);
			},

			onChangeVerticalAlignment(callback) {
				return changeVerticalAlignmentEmitter.subscribe(callback);
			},

			onChangeCellResizing(callback) {
				return changeCellResizingEmitter.subscribe(callback);
			},

			onClear(callback) {
				return clearContentsEmitter.subscribe(callback);
			},
		} satisfies TableConfigPortProps,
	);

	const publicPort: TablePublicPort = extendObjectProperties(
		unwrapPort.publicPort,
		currentComponentPort.publicPort,
		{
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
				return canInsertUpdateEmitter.subscribe(callback);
			},

			onContextMenuToggle(callback) {
				return contextMenuToggleEmitter.subscribe(callback);
			},

			onSectionTypeUpdate(callback) {
				return sectionTypeUpdateEmitter.subscribe(callback);
			},

			onMergeSplitUpdate(callback) {
				return mergeSplitUpdateEmitter.subscribe(callback);
			},

			onInsertDeleteUpdate(callback) {
				return insertDeleteUpdateEmitter.subscribe(callback);
			},

			onCellTypeUpdate(callback) {
				return cellTypeUpdateEmitter.subscribe(callback);
			},

			onVerticalAlignmentUpdate(callback) {
				return verticalAlignmentUpdateEmitter.subscribe(callback);
			},

			onCellResizingUpdate(callback) {
				return cellResizingUpdateEmitter.subscribe(callback);
			},

			onClearContentsUpdate(callback) {
				return clearContentsUpdateEmitter.subscribe(callback);
			},

			insert(params) {
				insertEmitter.emit(params);
			},

			changeSectionType(action) {
				changeSectionTypeEmitter.emit(action);
			},

			changeMergeSplit(action) {
				changeMergeSplitEmitter.emit(action);
			},

			changeInsertDelete(action) {
				changeInsertDeleteEmitter.emit(action);
			},

			changeCellType(action) {
				changeCellTypeEmitter.emit(action);
			},

			changeVerticalAlignment(action) {
				changeVerticalAlignmentEmitter.emit(action);
			},

			changeCellResizing(action) {
				changeCellResizingEmitter.emit(action);
			},

			clear() {
				clearContentsEmitter.emit();
			},
		} satisfies TablePublicPortProps,
	);

	return { configPort, publicPort };
};
