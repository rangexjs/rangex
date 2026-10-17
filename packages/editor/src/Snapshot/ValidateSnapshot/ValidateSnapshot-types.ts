import type {
	ComponentDraft,
	EditorNodeSnapshotValidation,
	FailedStoredSnapshotValidation,
	SnapshotLimits,
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

export type ValidateSnapshotResult = FailedStoredSnapshotValidation | null;
