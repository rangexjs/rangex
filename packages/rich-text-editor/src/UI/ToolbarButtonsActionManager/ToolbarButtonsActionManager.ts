import { toolbarButtonActionsName } from "../Constants";
import type {
	ActionListenerOption,
	EmitNodeInsertionChangeParams,
	OnNodeInsertionFn,
	UpdateActionListenerParams,
} from "./ToolbarButtonsActionManager-types";

export class ToolbarButtonsActionManager {
	#nodeInsertion: Set<OnNodeInsertionFn> = new Set();

	#updateListener({ type, callback, operation }: UpdateActionListenerParams) {
		if (type === toolbarButtonActionsName.nodeInsertion) {
			this.#nodeInsertion[operation](callback);
		}
	}

	subscribe(params: ActionListenerOption) {
		this.#updateListener({ ...params, operation: "add" });
	}

	unsubscribe(params: ActionListenerOption) {
		this.#updateListener({ ...params, operation: "delete" });
	}

	emitNodeInsertionChange(params: EmitNodeInsertionChangeParams) {
		for (const listener of this.#nodeInsertion) {
			listener(params);
		}
	}
}
