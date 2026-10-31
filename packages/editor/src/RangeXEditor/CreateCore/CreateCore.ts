import {
	type CreateFallbackRootEditable,
	createEditorAPI,
	migrateStoredSnapshot,
} from "@rangex/core";
import { ensureSanitizerConfigured } from "#sanitizer";
import { validateSnapshot } from "#snapshot";
import type {
	CreateCoreParams,
	ResolveStoredSnapshotParams,
	ResolveStoredSnapshotResult,
} from "./CreateCore-types";
import { createRoot } from "./CreateRoot";

/*
 * Migrates the given snapshot, then validates it by the SnapshotSchema. Resolves to the copy to load, or to null if it
 * can't be loaded, which makes the editor start from a new root instead.
 */
const resolveStoredSnapshot = ({
	storedSnapshot,
	snapshotSchema,
}: ResolveStoredSnapshotParams): ResolveStoredSnapshotResult => {
	if (!storedSnapshot) {
		return null;
	}

	const migrationResult = migrateStoredSnapshot({
		storedSnapshot,
		limits: snapshotSchema.limits,
	});

	if (!migrationResult.isValid) {
		console.warn("Snapshot migration failed.", migrationResult.reason);

		return null;
	}

	const validationResult = validateSnapshot({
		...snapshotSchema,
		storedSnapshot: migrationResult.storedSnapshot,
	});

	if (!validationResult.isValid) {
		console.warn("Snapshot validation failed.", validationResult.reason);

		return null;
	}

	return validationResult.storedSnapshot;
};

export const createCore = ({
	licenseKey,
	storedSnapshot,
	snapshotSchema,
}: CreateCoreParams) => {
	ensureSanitizerConfigured();

	const resolvedStoredSnapshot = resolveStoredSnapshot({
		storedSnapshot,
		snapshotSchema,
	});

	const createFallbackRootEditable: CreateFallbackRootEditable = ({
		storedSnapshotFailed,
	}) => {
		if (storedSnapshotFailed) {
			console.warn("Snapshot validation failed.", storedSnapshotFailed.reason);
		}

		const [type] = snapshotSchema.root.types;

		const rootEditable = createRoot({ type });

		return { rootEditable };
	};

	const { editorAPI } = createEditorAPI({
		licenseKey,
		storedSnapshot: resolvedStoredSnapshot,
		limits: snapshotSchema.limits,
		createFallbackRootEditable,
		shadowRootOptions: {
			mode: "open",
			serializable: true,
			slotAssignment: "manual",
		},
	});

	editorAPI.host.classList.add("editor-host");

	return { editorAPI };
};
