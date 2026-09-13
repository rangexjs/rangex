import type { TablePublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { FromPublicToReactivePort } from "../../_Utilities";
import type { ReactiveTablePort } from "./Table-types";

export const Table = <T extends TablePublicPort | undefined>(
	publicPort: T,
): FromPublicToReactivePort<T> => {
	if (!publicPort) {
		return undefined as FromPublicToReactivePort<T>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [contextMenuOpen, setContextMenuOpen] = createSignal(
		publicPort.contextMenuOpen,
	);
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

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onContextMenuOpenUpdate(setContextMenuOpen));
	onCleanup(publicPort.onSectionTypeUpdate(setSectionType));
	onCleanup(publicPort.onMergeSplitUpdate(setMergeSplit));
	onCleanup(publicPort.onInsertDeleteUpdate(setInsertDelete));
	onCleanup(publicPort.onCellTypeUpdate(setCellType));
	onCleanup(publicPort.onVerticalAlignmentUpdate(setVerticalAlignment));
	onCleanup(publicPort.onCellResizingUpdate(setCellResizing));
	onCleanup(publicPort.onClearContentsUpdate(setClearContents));

	const port: ReactiveTablePort = {
		contextMenuEl: publicPort.contextMenuEl,

		canInsert,
		contextMenuOpen,
		sectionType,
		mergeSplit,
		insertDelete,
		cellType,
		verticalAlignment,
		cellResizing,
		clearContents,

		insert: publicPort.insert,
		setSectionType: publicPort.setSectionType,
		setMergeSplit: publicPort.setMergeSplit,
		setInsertDelete: publicPort.setInsertDelete,
		setCellType: publicPort.setCellType,
		setVerticalAlignment: publicPort.setVerticalAlignment,
		setCellResizing: publicPort.setCellResizing,
		clear: publicPort.clear,
	};

	return port as FromPublicToReactivePort<T>;
};
