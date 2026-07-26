import type {
	ToolbarButtonValue,
	toolbarButtonActionsName,
	toolbarButtonsName,
} from "../Constants";

interface GetButtonType<Type extends ToolbarButtonValue> {
	type: Type;
}

// NodeInsertion
export interface AnchorActionState
	extends GetButtonType<typeof toolbarButtonsName.anchor> {}

export interface MediaActionState
	extends GetButtonType<typeof toolbarButtonsName.media> {}

export type NodeInsertionActionState = AnchorActionState | MediaActionState;

export type OnNodeInsertionFnProps = NodeInsertionActionState;

export type OnNodeInsertionFn = (props: OnNodeInsertionFnProps) => void;

export type EmitNodeInsertionChangeParams = NodeInsertionActionState;

export type ActionListenerMap = {
	[toolbarButtonActionsName.nodeInsertion]: OnNodeInsertionFn;
};

export type ActionListenerOption = {
	[Key in keyof ActionListenerMap]: {
		type: Key;
		callback: ActionListenerMap[Key];
	};
}[keyof ActionListenerMap];

export type UpdateActionListenerParams = ActionListenerOption & {
	operation: "add" | "delete";
};
