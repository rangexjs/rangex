import type {
	InsertRootLinePosition,
	TurnableComponentName,
	TurnIntoAvailability,
} from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveLineHandlerPort {
	readonly element: HTMLDivElement;

	turnIntoAvailability: Accessor<TurnIntoAvailability>;
	canRemove: Accessor<boolean>;
	canDuplicate: Accessor<boolean>;
	canUnwrap: Accessor<boolean>;

	dragStart(dragEvent: DragEvent): void;
	turnInto(name: TurnableComponentName): void;
	remove(): void;
	duplicate(): void;
	unwrap(): void;
	insertRootLine(position: InsertRootLinePosition): void;
}
