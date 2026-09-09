export type OnCommitSnapshotCallbackFn = () => void;

export interface CommitSnapshotConfigPort {
	onCommitSnapshot(callback: OnCommitSnapshotCallbackFn): () => void;
}

export interface CommitSnapshotPublicPort {
	commitSnapshot(): void;
}

export interface CommitSnapshotPort {
	configPort: CommitSnapshotConfigPort;
	publicPort: CommitSnapshotPublicPort;
}

export interface CreateCommitSnapshotPortResult extends CommitSnapshotPort {}
