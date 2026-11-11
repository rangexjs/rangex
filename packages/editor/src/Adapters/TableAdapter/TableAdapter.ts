import type { BlockComponent } from "@rangex/core";
import { extendObjectProperties } from "#utilities";
import {
	createCurrentComponentPort,
	createEmitter,
	createStateEmitter,
	createUnwrapPort,
} from "../_Utilities";
import type {
	CreateTableAdapterParams,
	CreateTableAdapterResult,
	OnChangeCellResizingCallbackFn,
	OnChangeCellTypeCallbackFn,
	OnChangeInsertDeleteCallbackFn,
	OnChangeMergeSplitCallbackFn,
	OnChangeSectionTypeCallbackFn,
	OnChangeVerticalAlignmentCallbackFn,
	OnClearContentsCallbackFn,
	OnContextMenuToggleCallbackFn,
	OnInsertCallbackFn,
	TableCellResizingState,
	TableCellTypeState,
	TableClearContentsState,
	TableConfigPort,
	TableConfigPortProps,
	TableInsertDeleteState,
	TableInternals,
	TableMergeSplitState,
	TablePublicPort,
	TablePublicPortProps,
	TableSectionTypeState,
	TableVerticalAlignmentState,
	UpdateStateParams,
} from "./TableAdapter-types";

export const createTableAdapter = (
	...params: CreateTableAdapterParams
): CreateTableAdapterResult => {
	const [_settings, { adapterBus, floatingContainer }] = params;

	adapterBus.registerAdapter("table");

	const tableLimits = adapterBus.getTableLimits();

	const contextMenuEl = document.createElement("div");
	floatingContainer.append(contextMenuEl);

	const internals: TableInternals = {
		// Rest
		contextMenuOpen: false,
	};

	// States
	const canInsertState = createStateEmitter<boolean>(false);
	const sectionTypeState = createStateEmitter<TableSectionTypeState>({
		header: { disabled: true },
		body: { disabled: true },
		footer: { disabled: true },
	});
	const mergeSplitState = createStateEmitter<TableMergeSplitState>({
		mergeSelected: { disabled: true },
		mergeUp: { disabled: true },
		mergeDown: { disabled: true },
		mergeLeft: { disabled: true },
		mergeRight: { disabled: true },
		splitHorizontally: { disabled: true },
		splitVertically: { disabled: true },
		splitFully: { disabled: true },
	});
	const insertDeleteState = createStateEmitter<TableInsertDeleteState>({
		insertRowAbove: { disabled: true },
		insertRowBelow: { disabled: true },
		insertColumnLeft: { disabled: true },
		insertColumnRight: { disabled: true },
		deleteRow: { disabled: true },
		deleteColumn: { disabled: true },
	});
	const cellTypeState = createStateEmitter<TableCellTypeState>({
		header: { disabled: true },
		data: { disabled: true },
	});
	const verticalAlignmentState =
		createStateEmitter<TableVerticalAlignmentState>({
			start: { disabled: true },
			center: { disabled: true },
			end: { disabled: true },
		});
	const cellResizingState = createStateEmitter<TableCellResizingState>({
		equalizeColumns: { disabled: true },
		minimizeRows: { disabled: true },
	});
	const clearContentsState = createStateEmitter<TableClearContentsState>({
		disabled: true,
	});

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
			canInsertState.set(canInsert);
		}

		if (sectionType !== undefined) {
			sectionTypeState.set(sectionType);
		}

		if (mergeSplit !== undefined) {
			mergeSplitState.set(mergeSplit);
		}

		if (insertDelete !== undefined) {
			insertDeleteState.set(insertDelete);
		}

		if (cellType !== undefined) {
			cellTypeState.set(cellType);
		}

		if (verticalAlignment !== undefined) {
			verticalAlignmentState.set(verticalAlignment);
		}

		if (cellResizing !== undefined) {
			cellResizingState.set(cellResizing);
		}

		if (clearContents !== undefined) {
			clearContentsState.set(clearContents);
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

			get limits() {
				return tableLimits;
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

			get limits() {
				return tableLimits;
			},

			get canInsert() {
				return canInsertState.get();
			},

			get contextMenuOpen() {
				return internals.contextMenuOpen;
			},

			get sectionType() {
				return sectionTypeState.get();
			},

			get mergeSplit() {
				return mergeSplitState.get();
			},

			get insertDelete() {
				return insertDeleteState.get();
			},

			get cellType() {
				return cellTypeState.get();
			},

			get verticalAlignment() {
				return verticalAlignmentState.get();
			},

			get cellResizing() {
				return cellResizingState.get();
			},

			get clearContents() {
				return clearContentsState.get();
			},

			onCanInsertUpdate(callback) {
				return canInsertState.subscribe(callback);
			},

			onContextMenuToggle(callback) {
				return contextMenuToggleEmitter.subscribe(callback);
			},

			onSectionTypeUpdate(callback) {
				return sectionTypeState.subscribe(callback);
			},

			onMergeSplitUpdate(callback) {
				return mergeSplitState.subscribe(callback);
			},

			onInsertDeleteUpdate(callback) {
				return insertDeleteState.subscribe(callback);
			},

			onCellTypeUpdate(callback) {
				return cellTypeState.subscribe(callback);
			},

			onVerticalAlignmentUpdate(callback) {
				return verticalAlignmentState.subscribe(callback);
			},

			onCellResizingUpdate(callback) {
				return cellResizingState.subscribe(callback);
			},

			onClearContentsUpdate(callback) {
				return clearContentsState.subscribe(callback);
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
