import type {
	CreateQuickActionsPortParams,
	CreateQuickActionsPortResult,
	OnQuickActionsOpenUpdateCallbackFn,
	QuickActionsConfigPort,
	QuickActionsInternals,
	QuickActionsPublicPort,
	UpdateStateParams,
} from "./QuickActionsPort-types";

export const createQuickActionsPort = ({
	floatingContainer,
}: CreateQuickActionsPortParams): CreateQuickActionsPortResult => {
	const quickActionsEl = document.createElement("div");
	floatingContainer.append(quickActionsEl);

	const internals: QuickActionsInternals = {
		quickActionsOpen: false,
	};

	// StateListeners
	const onQuickActionsOpenUpdateListeners: Set<OnQuickActionsOpenUpdateCallbackFn> =
		new Set();

	const updateState = ({ open }: UpdateStateParams) => {
		if (open !== undefined) {
			internals.quickActionsOpen = open;

			for (const listener of onQuickActionsOpenUpdateListeners) {
				listener(internals.quickActionsOpen);
			}
		}
	};

	const configPort: QuickActionsConfigPort = {
		get quickActionsEl() {
			return quickActionsEl;
		},

		updateQuickActions(params) {
			updateState(params);
		},
	};

	const publicPort: QuickActionsPublicPort = {
		get quickActionsEl() {
			return quickActionsEl;
		},

		get quickActionsOpen() {
			return internals.quickActionsOpen;
		},

		onQuickActionsOpenUpdate(callback) {
			onQuickActionsOpenUpdateListeners.add(callback);
			return () => onQuickActionsOpenUpdateListeners.delete(callback);
		},
	};

	return { configPort, publicPort };
};
