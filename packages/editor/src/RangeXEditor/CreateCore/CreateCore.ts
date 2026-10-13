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
}: MigrateIfStoredSnapshotParams): MigrateIfStoredSnapshotResult => {
	if (!storedSnapshot) {
		return null;
	}

	// TODO: We have to add a validator that check if every storage is up to date
	const migrationResult = migrateStoredSnapshot({ storedSnapshot });

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
}: CreateCoreParams) => {
	const migratedStoredSnapshot = migrateIfStoredSnapshot({ storedSnapshot });

	const { editorAPI } = createEditorAPI({
		licenseKey,
		storedSnapshot: migratedStoredSnapshot,
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
