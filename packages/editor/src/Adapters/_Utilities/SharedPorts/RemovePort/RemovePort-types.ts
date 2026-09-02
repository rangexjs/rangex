export type OnRemoveCallbackFn = () => void;

export interface RemoveConfigPort {
	onRemove(callback: OnRemoveCallbackFn): () => void;
}

export interface RemovePublicPort {
	remove(): void;
}

export interface RemovePort {
	configPort: RemoveConfigPort;
	publicPort: RemovePublicPort;
}

export interface CreateRemovePortResult extends RemovePort {}
