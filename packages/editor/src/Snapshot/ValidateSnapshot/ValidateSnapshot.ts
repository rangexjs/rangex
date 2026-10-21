import {
	type StoredSnapshot,
	snapshotManager,
	validateStoredSnapshot,
} from "@rangex/core";
import { ensureSanitizerConfigured } from "#sanitizer";
import { validateComponents } from "./ValidateComponents";
import type {
	ValidateSnapshotParams,
	ValidateSnapshotResult,
} from "./ValidateSnapshot-types";

/*
 * Validates a StoredSnapshot by the engine's rules (with the SanitizerPolicies set by configureSanitizer, the basePolicy
 * alone if it hasn't been called), then every component in it by the validator registered for its name. A component
 * without a validator is invalid. A valid snapshot is returned as a copy with the components' resolved attributes (see
 * resolveElementAttrs), the one to save or restore. The nodes of a failure belong to that copy, not to the given
 * snapshot.
 */
export const validateSnapshot = ({
	storedSnapshot,
	limits,
	componentValidators,
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

	const componentsFailed = validateComponents({
		rootEditableDraft,
		componentValidators,
	});

	if (componentsFailed) {
		return { isValid: false, ...componentsFailed };
	}

	const resolvedSnapshot =
		snapshotManager.createSnapshotFromDraft(rootEditableDraft);

	return {
		isValid: true,
		storedSnapshot: { ...validStoredSnapshot, snapshot: resolvedSnapshot },
	};
};
