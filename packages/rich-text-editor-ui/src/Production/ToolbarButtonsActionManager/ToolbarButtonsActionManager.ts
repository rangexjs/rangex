import { toolbarButtonActionsName } from "../Constants";
import type {
	ActionListenerOption,
	EmitFormatStylesChangeParams,
	EmitHistoryNavigationChangeParams,
	EmitNodeInsertionChangeParams,
	EmitNonCategorizedOperationChangeParams,
	OnFormatStylesFn,
	OnHistoryNavigationFn,
	OnNodeInsertionFn,
	OnNonCategorizedOperationFn,
	UpdateActionListenerParams,
} from "./ToolbarButtonsActionManager-types";

export class ToolbarButtonsActionManager {
	#formatStylesListeners: Set<OnFormatStylesFn> = new Set();
	#historyNavigationListeners: Set<OnHistoryNavigationFn> = new Set();
	#nodeInsertion: Set<OnNodeInsertionFn> = new Set();
	#nonCategorizedOperation: Set<OnNonCategorizedOperationFn> = new Set();

	#updateListener({ type, callback, operation }: UpdateActionListenerParams) {
		if (type === toolbarButtonActionsName.formatStyles) {
			this.#formatStylesListeners[operation](callback);
		}

		if (type === toolbarButtonActionsName.historyNavigation) {
			this.#historyNavigationListeners[operation](callback);
		}

		if (type === toolbarButtonActionsName.nodeInsertion) {
			this.#nodeInsertion[operation](callback);
		}

		if (type === toolbarButtonActionsName.nonCategorizedOperation) {
			this.#nonCategorizedOperation[operation](callback);
		}
	}

	subscribe(params: ActionListenerOption) {
		this.#updateListener({ ...params, operation: "add" });
	}

	unsubscribe(params: ActionListenerOption) {
		this.#updateListener({ ...params, operation: "delete" });
	}

	emitFormatStylesChange(params: EmitFormatStylesChangeParams) {
		for (const listener of this.#formatStylesListeners) {
			listener(params);
		}
	}

	emitHistoryNavigationChange(params: EmitHistoryNavigationChangeParams) {
		for (const listener of this.#historyNavigationListeners) {
			listener(params);
		}
	}

	emitNodeInsertionChange(params: EmitNodeInsertionChangeParams) {
		for (const listener of this.#nodeInsertion) {
			listener(params);
		}
	}

	emitNonCategorizedOperationChange(
		params: EmitNonCategorizedOperationChangeParams,
	) {
		for (const listener of this.#nonCategorizedOperation) {
			listener(params);
		}
	}
}
