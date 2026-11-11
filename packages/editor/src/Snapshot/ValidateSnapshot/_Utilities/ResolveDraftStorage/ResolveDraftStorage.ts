import { assertNever, matchJSON } from "#utilities";

import { describeJSONMismatch, formatNodePath } from "../Utilities";
import type {
	DraftStorage,
	ResolveDraftStorageParams,
	ResolveDraftStorageResult,
} from "./ResolveDraftStorage-types";

/*
 * Runs the consumer's validateStorage on a component's or the Root's storage, which must already match its storage
 * pattern. It gets a copy, so the storage can only change through a fallback: the fallback must match the pattern too,
 * then it replaces the storage. Fails on a reject, or on a fallback that doesn't match.
 */
export const resolveDraftStorage = <TStorage extends DraftStorage>({
	nodeDraft,
	storagePattern,
	validateStorage,
}: ResolveDraftStorageParams<TStorage>): ResolveDraftStorageResult => {
	if (!validateStorage) {
		return null;
	}

	const storage = structuredClone(nodeDraft.customStorage);

	// The node's state check guarantees the storage's shape
	const validationFailed = validateStorage({ storage: storage as TStorage });

	if (!validationFailed) {
		return null;
	}

	if (validationFailed.kind === "reject") {
		const nodePath = formatNodePath({
			rootDraft: nodeDraft,
			nodeDraft,
		});

		return {
			sourceSnapshot: nodeDraft,
			failedSnapshot: nodeDraft,
			reason: `${nodePath}: invalid customStorage (${validationFailed.reason}).`,
		};
	}

	if (validationFailed.kind === "fallback") {
		const { value } = validationFailed;

		const mismatch = matchJSON({ value, pattern: storagePattern });

		if (mismatch) {
			return {
				sourceSnapshot: nodeDraft,
				failedSnapshot: nodeDraft,
				reason: describeJSONMismatch({
					rootDraft: nodeDraft,
					nodeDraft,
					value: { customStorage: value },
					mismatch: {
						...mismatch,
						path: ["customStorage", ...mismatch.path],
					},
				}),
			};
		}

		nodeDraft.customStorage = value;

		return null;
	}

	return assertNever(validationFailed);
};
