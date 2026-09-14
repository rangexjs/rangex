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
	const onToggleListeners: Set<OnQuickActionsToggleCallbackFn> = new Set();

	const updateState = ({ isOpen }: UpdateStateParams) => {
		if (isOpen !== undefined) {
			internals.isOpen = isOpen;

			for (const listener of onToggleListeners) {
				listener();
			}
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
			onToggleListeners.add(callback);
			return () => onToggleListeners.delete(callback);
		},
	};

	return { configPort, publicPort };
};
