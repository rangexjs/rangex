import type {
	ComponentDraft,
	EditorNodeSnapshotValidation,
	FailedStoredSnapshotValidation,
	SnapshotLimits,
	StoredSnapshot,
} from "@rangex/core";

import type { SnapshotComponents } from "./CreateComponentValidators";
import type { SnapshotRoot } from "./ValidateRoot";

export interface ValidateComponentParams {
	componentDraft: ComponentDraft;
}

export type ValidateComponentResult = EditorNodeSnapshotValidation;

export type ValidateComponentFn = (params: ValidateComponentParams) => ValidateComponentResult;

export interface ComponentValidator {
	name: string;
	validate: ValidateComponentFn;
}

/*
 * What a snapshot must be: createEditor validates the snapshot it loads by it, validateSnapshot wherever else one is
 * validated. createEditor also builds the components' attribute validators from it, so the editor and a snapshot follow
 * the same rules.
 */
export interface SnapshotSchema {
	limits: SnapshotLimits;
	root: SnapshotRoot;
	components: SnapshotComponents;
}

export interface ValidateSnapshotParams extends SnapshotSchema {
	storedSnapshot: object;
}

export interface ValidateSnapshotSucceeded {
	isValid: true;
	storedSnapshot: StoredSnapshot;
}

export interface ValidateSnapshotFailed extends FailedStoredSnapshotValidation {
	isValid: false;
}

export type ValidateSnapshotResult = ValidateSnapshotSucceeded | ValidateSnapshotFailed;
