import {
	type CreateFallbackRootEditable,
	configureSanitizer,
	createBeamText,
	createContentLine,
	createEditorAPI,
	createRootEditable,
	migrateStoredSnapshot,
} from "@rangex/core";
import { createRootStorage } from "#storage";
import type {
	CreateCoreParams,
	MigrateIfStoredSnapshotParams,
	MigrateIfStoredSnapshotResult,
} from "./CreateCore-types";

const migrateIfStoredSnapshot = ({
	storedSnapshot,
	limits,
}: MigrateIfStoredSnapshotParams): MigrateIfStoredSnapshotResult => {
	if (!storedSnapshot) {
		return null;
	}

	// TODO: We have to add a validator that check if every storage is up to date
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

	const rootEditable = createRootEditable({
		customStorage: createRootStorage(),
		display: "block multi-line",
		childNodes: [
			createContentLine({
				localName: "p",
				childNodes: [createBeamText({})],
			}),
		],
	});

	return { rootEditable };
};

// TODO: Set policy rules
configureSanitizer({ "*": { "*": () => true } });

export const createCore = ({
	licenseKey,
	storedSnapshot,
	limits,
}: CreateCoreParams) => {
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
