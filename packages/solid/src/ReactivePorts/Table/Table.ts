import type { TablePublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type { ReactiveTablePort, ReactiveTableResult } from "./Table-types";

export const Table = (publicPort: TablePublicPort): ReactiveTableResult => {
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

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onCanInsertUpdate(setCanInsert));
	unsubscribeList.add(publicPort.onContextMenuOpenUpdate(setContextMenuOpen));
	unsubscribeList.add(publicPort.onSectionTypeUpdate(setSectionType));
	unsubscribeList.add(publicPort.onMergeSplitUpdate(setMergeSplit));
	unsubscribeList.add(publicPort.onInsertDeleteUpdate(setInsertDelete));
	unsubscribeList.add(publicPort.onCellTypeUpdate(setCellType));
	unsubscribeList.add(
		publicPort.onVerticalAlignmentUpdate(setVerticalAlignment),
	);
	unsubscribeList.add(publicPort.onCellResizingUpdate(setCellResizing));
	unsubscribeList.add(publicPort.onClearContentsUpdate(setClearContents));

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

	const dispose = () => {
		for (const unsubscribe of unsubscribeList) {
			unsubscribe();
		}
	};

	return { port, dispose };
};
