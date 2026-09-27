import type { TablePublicPort } from "@rangex/editor";
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
	const [isActive, setIsActive] = createSignal(publicPort.isActive);
	const [sectionType, setSectionType] = createSignal(publicPort.sectionType);
	const [mergeSplit, setMergeSplit] = createSignal(publicPort.mergeSplit);
	const [insertDelete, setInsertDelete] = createSignal(publicPort.insertDelete);
	const [cellType, setCellType] = createSignal(publicPort.cellType);
	const [verticalAlignment, setVerticalAlignment] = createSignal(
		publicPort.verticalAlignment,
	);
	const [cellResizing, setCellResizing] = createSignal(publicPort.cellResizing);
	const [clearContents, setClearContents] = createSignal(
		publicPort.clearContents,
	);
	const [currentComponent, setCurrentComponent] = createSignal(
		publicPort.currentComponent,
	);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onIsActiveUpdate(setIsActive));
	onCleanup(publicPort.onSectionTypeUpdate(setSectionType));
	onCleanup(publicPort.onMergeSplitUpdate(setMergeSplit));
	onCleanup(publicPort.onInsertDeleteUpdate(setInsertDelete));
	onCleanup(publicPort.onCellTypeUpdate(setCellType));
	onCleanup(publicPort.onVerticalAlignmentUpdate(setVerticalAlignment));
	onCleanup(publicPort.onCellResizingUpdate(setCellResizing));
	onCleanup(publicPort.onClearContentsUpdate(setClearContents));
	onCleanup(publicPort.onCurrentComponentUpdate(setCurrentComponent));

	const port: ReactiveTablePort = {
		canInsert,
		isActive,
		sectionType,
		mergeSplit,
		insertDelete,
		cellType,
		verticalAlignment,
		cellResizing,
		clearContents,
		currentComponent,
	};

	return port as PreserveUndefined<T, ReactiveTablePort>;
};
