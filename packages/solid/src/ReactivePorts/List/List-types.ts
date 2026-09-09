import type { ListLocalName } from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ListPlacementOption {
	localName: ListLocalName;
}

export interface ListInsertParams extends ListPlacementOption {}

export interface ListWrapParams extends ListPlacementOption {}

export interface ReactiveListPort {
	canInsert: Accessor<boolean>;
	canWrap: Accessor<boolean>;

	insert(params: ListInsertParams): void;
	wrap(params: ListWrapParams): void;
}

export interface ReactiveListResult {
	port: ReactiveListPort;
	dispose: () => void;
}
