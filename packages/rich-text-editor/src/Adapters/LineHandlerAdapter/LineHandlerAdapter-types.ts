import type { BlockComponentName, CreateAdapterConstructor } from "#ports";
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

export type TurnableComponentName = Extract<
	BlockComponentName,
	"accordion-item" | "block-quote" | "code-block" | "list" | "todo-list"
>;

export type TurnIntoAvailability = Record<TurnableComponentName, boolean>;

export interface LineHandlerState {
	turnInto?: TurnIntoAvailability;
	canDelete?: boolean;
	canDuplicate?: boolean;
}

export interface UpdateLineHandlerStateParams extends LineHandlerState {}

export type OnTurnIntoUpdateFn = (turnInto: TurnIntoAvailability) => void;
export type OnCanDeleteUpdateFn = (canDelete: boolean) => void;
export type OnCanDuplicateUpdateFn = (canDuplicate: boolean) => void;

export interface LineHandlerUIPort {
	readonly popover: UIOverlayMount;
	readonly turnInto: TurnIntoAvailability;
	onTurnIntoUpdate(callback: OnTurnIntoUpdateFn): () => void;
	readonly canDelete: boolean;
	onCanDeleteUpdate(callback: OnCanDeleteUpdateFn): () => void;
	readonly canDuplicate: boolean;
	onCanDuplicateUpdate(callback: OnCanDuplicateUpdateFn): () => void;
	emitDelete(): void;
	emitDuplicate(): void;
	emitInsertRootLine(position: InsertRootLinePosition): void;
	emitDragStart(dragEvent: DragEvent): void;
	emitTurnInto(name: TurnableComponentName): void;
}

export type OnDragStartFn = (dragEvent: DragEvent) => void;
export type OnTurnIntoFn = (name: TurnableComponentName) => void;

export interface LineHandlerEditorPort
	extends DeletePort,
		DuplicatePort,
		InsertRootLinePort {
	readonly popover: EditorOverlayMount;
	updateState(params: UpdateLineHandlerStateParams): void;
	onDragStart(callback: OnDragStartFn): () => void;
	onTurnInto(callback: OnTurnIntoFn): () => void;
}
