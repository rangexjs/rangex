import type { TableSectionView } from "rich-text-area";
import type {
	DOMChildNode,
	StorageMap,
} from "../../CreateHTMLFromSnapshotView-types";

export interface CreateTableSectionHTMLParams {
	tableSectionView: TableSectionView;
	childNodes: DOMChildNode[];
	storageMap: StorageMap;
}

export type CreateTableSectionHTMLResult = HTMLElement;
