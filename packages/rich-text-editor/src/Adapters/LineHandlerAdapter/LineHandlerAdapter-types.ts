import type { CreateAdapterConstructor } from "#ports";
import type {
	DeletePort,
	DuplicatePort,
	EditorOverlayMount,
	InsertRootLinePort,
	InsertRootLinePosition,
	UIOverlayMount,
} from "../_Utilities";

export type LineHandlerAdapterConstructorParams = CreateAdapterConstructor<{
	[index: string]: never;
}>;

export interface LineHandlerUIPort {
	readonly popover: UIOverlayMount;
	emitDelete(): void;
	emitDuplicate(): void;
	emitInsertRootLine(position: InsertRootLinePosition): void;
	emitDragStart(dragEvent: DragEvent): void;
}

export type OnDragStartFn = (dragEvent: DragEvent) => void;

export interface LineHandlerEditorPort
	extends DeletePort,
		DuplicatePort,
		InsertRootLinePort {
	readonly popover: EditorOverlayMount;
	onDragStart(callback: OnDragStartFn): () => void;
}
