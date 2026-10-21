import type {
	ComponentDraft,
	EditorNodeSnapshotValidation,
	FailedStoredSnapshotValidation,
	SnapshotLimits,
	StoredSnapshot,
} from "@rangex/core";

export interface ValidateComponentParams {
	componentDraft: ComponentDraft;
}

export type ValidateComponentResult = EditorNodeSnapshotValidation;

export type ValidateComponentFn = (
	params: ValidateComponentParams,
) => ValidateComponentResult;

export interface ComponentValidator {
	name: string;
	validate: ValidateComponentFn;
}

export interface ValidateSnapshotParams {
	storedSnapshot: object;
	limits: SnapshotLimits;
	componentValidators: ComponentValidator[];
}

export interface ValidateSnapshotSucceeded {
	isValid: true;
	storedSnapshot: StoredSnapshot;
}

export interface ValidateSnapshotFailed extends FailedStoredSnapshotValidation {
	isValid: false;
}

export type ValidateSnapshotResult =
	| ValidateSnapshotSucceeded
	| ValidateSnapshotFailed;
