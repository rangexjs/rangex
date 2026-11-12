import type { TablePublicPort } from "@rangex/editor/table";
import { createSignal, onCleanup } from "solid-js";

import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveTablePort } from "./Table-types";

export const Table = <T extends TablePublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveTablePort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveTablePort>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [sectionType, setSectionType] = createSignal(publicPort.sectionType);
	const [mergeSplit, setMergeSplit] = createSignal(publicPort.mergeSplit);
	const [insertDelete, setInsertDelete] = createSignal(publicPort.insertDelete);
	const [cellType, setCellType] = createSignal(publicPort.cellType);
	const [verticalAlignment, setVerticalAlignment] = createSignal(publicPort.verticalAlignment);
	const [cellResizing, setCellResizing] = createSignal(publicPort.cellResizing);
	const [clearContents, setClearContents] = createSignal(publicPort.clearContents);
	const [currentComponent, setCurrentComponent] = createSignal(publicPort.currentComponent);
	const [isSelectionActive, setIsSelectionActive] = createSignal(publicPort.isSelectionActive);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onSectionTypeUpdate(setSectionType));
	onCleanup(publicPort.onMergeSplitUpdate(setMergeSplit));
	onCleanup(publicPort.onInsertDeleteUpdate(setInsertDelete));
	onCleanup(publicPort.onCellTypeUpdate(setCellType));
	onCleanup(publicPort.onVerticalAlignmentUpdate(setVerticalAlignment));
	onCleanup(publicPort.onCellResizingUpdate(setCellResizing));
	onCleanup(publicPort.onClearContentsUpdate(setClearContents));
	onCleanup(publicPort.onCurrentComponentUpdate(setCurrentComponent));
	onCleanup(publicPort.onIsSelectionActiveUpdate(setIsSelectionActive));

	const port: ReactiveTablePort = {
		canInsert,
		sectionType,
		mergeSplit,
		insertDelete,
		cellType,
		verticalAlignment,
		cellResizing,
		clearContents,
		currentComponent,
		isSelectionActive,
	};

	return port as PreserveUndefined<T, ReactiveTablePort>;
};
