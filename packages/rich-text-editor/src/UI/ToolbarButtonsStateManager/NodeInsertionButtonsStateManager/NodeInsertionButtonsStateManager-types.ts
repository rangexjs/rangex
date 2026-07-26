import type { toolbarButtonsName } from "../../Constants";
import type {
	AnchorToolbarButtonState,
	MediaToolbarButtonState,
} from "../../ToolbarButtonProps";

// Anchor
export interface UpdateAnchorStateParams extends AnchorToolbarButtonState {}

export type UpdateAnchorStateFn = (params: UpdateAnchorStateParams) => void;

// Media
export interface UpdateMediaStateParams extends MediaToolbarButtonState {}

export type UpdateMediaStateFn = (params: UpdateMediaStateParams) => void;

export interface NodeInsertionButtonsState {
	anchor: Partial<AnchorToolbarButtonState>;
	media: Partial<MediaToolbarButtonState>;
}

export type StateChangeFn = () => void;

export type ListenerMap = {
	[toolbarButtonsName.anchor]: UpdateAnchorStateFn;
	[toolbarButtonsName.media]: UpdateMediaStateFn;
	statechange: () => void;
};

export type ListenerOption = {
	[Key in keyof ListenerMap]: { type: Key; callback: ListenerMap[Key] };
}[keyof ListenerMap];

export type UpdateListenerParams = ListenerOption & {
	operation: "add" | "delete";
};

export interface UpdateNodeInsertionButtonsStateParams
	extends Partial<NodeInsertionButtonsState> {}
