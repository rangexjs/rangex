export interface QuickActionsState {
	open: boolean;
}

export interface UpdateStateParams {
	open?: boolean;
}

export interface QuickActionsInternals {
	quickActionsOpen: boolean;
}

export interface QuickActionsConfigPort {
	readonly quickActionsEl: HTMLDivElement;

	updateQuickActions(params: UpdateStateParams): void;
}

export type OnQuickActionsOpenUpdateCallbackFn = (
	quickActionsOpen: boolean,
) => void;

export interface QuickActionsPublicPort {
	readonly quickActionsEl: HTMLDivElement;

	readonly quickActionsOpen: boolean;

	onQuickActionsOpenUpdate(
		callback: OnQuickActionsOpenUpdateCallbackFn,
	): () => void;
}

export interface QuickActionsPort {
	configPort: QuickActionsConfigPort;
	publicPort: QuickActionsPublicPort;
}

export interface CreateQuickActionsPortParams {
	floatingContainer: HTMLDivElement;
}

export interface CreateQuickActionsPortResult extends QuickActionsPort {}
