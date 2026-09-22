export interface QuickActionsState {
	open: boolean;
}

export interface UpdateStateParams {
	isOpen?: boolean;
}

export interface QuickActionsInternals {
	isOpen: boolean;
}

export interface QuickActionsConfigPort {
	readonly element: HTMLDivElement;

	updateQuickActions(params: UpdateStateParams): void;
}

export type OnQuickActionsToggleCallbackFn = () => void;

export interface QuickActionsPublicPort {
	readonly element: HTMLDivElement;
	readonly isOpen: boolean;

	onToggle(callback: OnQuickActionsToggleCallbackFn): () => void;
}

export interface QuickActionsPort {
	configPort: QuickActionsConfigPort;
	publicPort: QuickActionsPublicPort;
}

export interface CreateQuickActionsPortParams {
	floatingContainer: HTMLDivElement;
}

export interface CreateQuickActionsPortResult extends QuickActionsPort {}
