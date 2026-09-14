export type OnDuplicateCallbackFn = () => void;

export interface DuplicateConfigPort {
	onDuplicate(callback: OnDuplicateCallbackFn): () => void;
}

export interface DuplicatePublicPort {
	duplicate(): void;
}

export interface DuplicatePort {
	configPort: DuplicateConfigPort;
	publicPort: DuplicatePublicPort;
}

export interface CreateDuplicatePortResult extends DuplicatePort {}
