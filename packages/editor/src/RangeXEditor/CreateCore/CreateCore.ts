import {
	type CreateFallbackRootEditable,
	createEditorAPI,
	migrateStoredSnapshot,
} from "@rangex/core";
import { rootTypes } from "#constants";
import { ensureSanitizerConfigured } from "#sanitizer";
import type {
	CreateCoreParams,
	MigrateIfStoredSnapshotParams,
	MigrateIfStoredSnapshotResult,
} from "./CreateCore-types";
import { createRoot } from "./CreateRoot";

const migrateIfStoredSnapshot = ({
	storedSnapshot,
	limits,
}: MigrateIfStoredSnapshotParams): MigrateIfStoredSnapshotResult => {
	if (!storedSnapshot) {
		return null;
	}

	// TODO: We have to add a validator that checks if the RootStorage's version is up to date
	const migrationResult = migrateStoredSnapshot({ storedSnapshot, limits });

	if (!migrationResult.isValid) {
		console.warn("Snapshot migration failed.", migrationResult.reason);

		return null;
	}

	return migrationResult.storedSnapshot;
};

const createFallbackRootEditable: CreateFallbackRootEditable = ({
	storedSnapshotFailed,
}) => {
	if (storedSnapshotFailed) {
		console.warn("Snapshot validation failed.", storedSnapshotFailed.reason);
	}

	const rootEditable = createRoot({ type: rootTypes.richText });

	return { rootEditable };
};

export const createCore = ({
	licenseKey,
	storedSnapshot,
	limits,
}: CreateCoreParams) => {
	ensureSanitizerConfigured();

	const migratedStoredSnapshot = migrateIfStoredSnapshot({
		storedSnapshot,
		limits,
	});

	const { editorAPI } = createEditorAPI({
		licenseKey,
		storedSnapshot: migratedStoredSnapshot,
		limits,
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
