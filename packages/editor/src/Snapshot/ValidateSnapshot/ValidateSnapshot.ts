import {
	type StoredSnapshot,
	snapshotManager,
	validateStoredSnapshot,
} from "@rangex/core";
import { ensureSanitizerConfigured } from "#sanitizer";
import { createComponentValidators } from "./CreateComponentValidators";
import { resolveNodeStorages } from "./ResolveNodeStorages";
import { resolveTemplateVariableTexts } from "./ResolveTemplateVariableTexts";
import { validateComponents } from "./ValidateComponents";
import { validateRoot } from "./ValidateRoot";
import type {
	ValidateSnapshotParams,
	ValidateSnapshotResult,
} from "./ValidateSnapshot-types";

/*
 * Validates a StoredSnapshot by the engine's rules (with the SanitizerPolicies set by configureSanitizer, the basePolicy
 * alone if it hasn't been called), then the RootEditable by the given root, then every component in it by its
 * validator. Only the given components are allowed:
 * any other one is invalid. The storage of every other node is dropped (see resolveNodeStorages). Finally, the
 * TemplateVariables' display texts are matched to the Root's storage (see resolveTemplateVariableTexts). A valid snapshot
 * is returned as a copy with the resolved storages, texts and the components' resolved attributes (see
 * resolveElementAttrs), the one to save or restore. The nodes of a failure belong to that copy, not to the given
 * snapshot.
 */
export const validateSnapshot = ({
	storedSnapshot,
	limits,
	root,
	components,
}: ValidateSnapshotParams): ValidateSnapshotResult => {
	ensureSanitizerConfigured();

	const engineValidationFailed = validateStoredSnapshot({
		storedSnapshot,
		limits,
	});

	if (engineValidationFailed) {
		return { isValid: false, ...engineValidationFailed };
	}

	// The engine's validation guarantees the StoredSnapshot's shape
	const validStoredSnapshot = storedSnapshot as StoredSnapshot;

	const rootEditableDraft = snapshotManager.createDraftFromSnapshot(
		validStoredSnapshot.snapshot,
	);

	resolveNodeStorages({ rootEditableDraft });

	const rootFailed = validateRoot({ rootEditableDraft, ...root });

	if (rootFailed) {
		return { isValid: false, ...rootFailed };
	}

	const componentValidators = createComponentValidators({ components });

	const componentsFailed = validateComponents({
		rootEditableDraft,
		componentValidators,
	});

	if (componentsFailed) {
		return { isValid: false, ...componentsFailed };
	}

	resolveTemplateVariableTexts({ rootEditableDraft });

	const resolvedSnapshot =
		snapshotManager.createSnapshotFromDraft(rootEditableDraft);

	return {
		isValid: true,
		storedSnapshot: { ...validStoredSnapshot, snapshot: resolvedSnapshot },
	};
};
