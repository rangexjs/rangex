import type { SnapshotConstructorParams } from "./Snapshot-types";

export class Snapshot {
	#editorAPI;

	constructor({ editorAPI }: SnapshotConstructorParams) {
		this.#editorAPI = editorAPI;
	}

	createStored() {
		return this.#editorAPI.createStoredSnapshot();
	}

	commit() {
		const snapshotTimeline = this.#editorAPI.getSnapshotTimeline();
		snapshotTimeline.registerSnapshotBoundary();
	}
}
