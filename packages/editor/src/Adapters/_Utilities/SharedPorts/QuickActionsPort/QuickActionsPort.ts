import { createEmitter } from "../../CreateEmitter";
import type {
	CreateQuickActionsPortParams,
	CreateQuickActionsPortResult,
	OnQuickActionsToggleCallbackFn,
	QuickActionsConfigPort,
	QuickActionsInternals,
	QuickActionsPublicPort,
	UpdateStateParams,
} from "./QuickActionsPort-types";

export const createQuickActionsPort = ({
	floatingContainer,
}: CreateQuickActionsPortParams): CreateQuickActionsPortResult => {
	const element = document.createElement("div");
	floatingContainer.append(element);

	const internals: QuickActionsInternals = {
		isOpen: false,
	};

	// CommandListeners
	const toggleEmitter = createEmitter<OnQuickActionsToggleCallbackFn>();

	const updateState = ({ isOpen }: UpdateStateParams) => {
		if (isOpen !== undefined) {
			internals.isOpen = isOpen;

			toggleEmitter.emit();
		}
	};

	const configPort: QuickActionsConfigPort = {
		get element() {
			return element;
		},

		updateQuickActions(params) {
			updateState(params);
		},
	};

	const publicPort: QuickActionsPublicPort = {
		get element() {
			return element;
		},

		get isOpen() {
			return internals.isOpen;
		},

		onToggle(callback) {
			return toggleEmitter.subscribe(callback);
		},
	};

	return { configPort, publicPort };
};
