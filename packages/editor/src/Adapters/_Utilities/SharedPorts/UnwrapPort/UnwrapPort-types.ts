export type OnUnwrapCallbackFn = () => void;

export interface UnwrapConfigPort {
	onUnwrap(callback: OnUnwrapCallbackFn): () => void;
}

export interface UnwrapPublicPort {
	unwrap(): void;
}

export interface UnwrapPort {
	configPort: UnwrapConfigPort;
	publicPort: UnwrapPublicPort;
}

export interface CreateUnwrapPortResult extends UnwrapPort {}
