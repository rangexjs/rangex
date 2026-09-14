import type { BlockComponentName } from "#engine-links";
import type {
	CreateAdapterParams,
	DuplicateConfigPort,
	DuplicatePublicPort,
	InsertRootLineConfigPort,
	InsertRootLinePublicPort,
	RemoveConfigPort,
	RemovePublicPort,
	UnwrapConfigPort,
	UnwrapPublicPort,
} from "../_Utilities";

export type TurnableComponentName = Extract<
	BlockComponentName,
	"accordion-item" | "block-quote" | "code-block" | "list" | "todo-list"
>;

export type TurnIntoAvailability = Record<TurnableComponentName, boolean>;

export interface LineHandlerState {
	turnIntoAvailability?: TurnIntoAvailability;
	canRemove?: boolean;
	canDuplicate?: boolean;
	canUnwrap?: boolean;
}

export type OnTurnIntoAvailabilityUpdateCallbackFn = (
	turnIntoAvailability: TurnIntoAvailability,
) => void;
export type OnCanRemoveUpdateCallbackFn = (canRemove: boolean) => void;
export type OnCanDuplicateUpdateCallbackFn = (canDuplicate: boolean) => void;
export type OnCanUnwrapUpdateCallbackFn = (canUnwrap: boolean) => void;

export type OnDragStartCallbackFn = (dragEvent: DragEvent) => void;
export type OnTurnIntoCallbackFn = (name: TurnableComponentName) => void;

export interface UpdateStateParams extends LineHandlerState {}

export interface LineHandlerConfigPortProps {
	readonly element: HTMLDivElement;

	updateState(params: UpdateStateParams): void;

	onDragStart(callback: OnDragStartCallbackFn): () => void;
	onTurnInto(callback: OnTurnIntoCallbackFn): () => void;
}

export interface LineHandlerConfigPort
	extends LineHandlerConfigPortProps,
		RemoveConfigPort,
		UnwrapConfigPort,
		DuplicateConfigPort,
		InsertRootLineConfigPort {}

export interface LineHandlerPublicPortProps {
	readonly element: HTMLDivElement;

	readonly turnIntoAvailability: TurnIntoAvailability;
	readonly canRemove: boolean;
	readonly canDuplicate: boolean;
	readonly canUnwrap: boolean;

	onTurnIntoAvailabilityUpdate(
		callback: OnTurnIntoAvailabilityUpdateCallbackFn,
	): () => void;
	onCanRemoveUpdate(callback: OnCanRemoveUpdateCallbackFn): () => void;
	onCanDuplicateUpdate(callback: OnCanDuplicateUpdateCallbackFn): () => void;
	onCanUnwrapUpdate(callback: OnCanUnwrapUpdateCallbackFn): () => void;

	dragStart(dragEvent: DragEvent): void;
	turnInto(name: TurnableComponentName): void;
}

export interface LineHandlerPublicPort
	extends LineHandlerPublicPortProps,
		RemovePublicPort,
		UnwrapPublicPort,
		DuplicatePublicPort,
		InsertRootLinePublicPort {}

export interface LineHandlerInternals {
	// States
	turnIntoAvailability: TurnIntoAvailability;
	canRemove: boolean;
	canDuplicate: boolean;
	canUnwrap: boolean;
}

export interface LineHandlerAdapter {
	configPort: LineHandlerConfigPort;
	publicPort: LineHandlerPublicPort;
}

export interface LineHandlerSettings {}

export interface CreateLineHandlerAdapterParams
	extends CreateAdapterParams<LineHandlerSettings> {}

export interface CreateLineHandlerAdapterResult extends LineHandlerAdapter {}
