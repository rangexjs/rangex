import {
	createBeamText,
	createContentLine,
	createEditorAPI,
	createRootEditable,
	migrateStoredSnapshot,
} from "rich-text-area";
import { createRootStorage } from "#storage";
import { getDefaultContentLineLocalNamesStyles } from "./_Utilities";
import type {
	CreateCoreParams,
	CreateRootEditableFromParams,
	CreateRootEditableFromResult,
} from "./CreateCore-types";

const createRootEditableFrom = ({
	storedSnapshot,
}: CreateRootEditableFromParams): CreateRootEditableFromResult => {
	if (storedSnapshot) {
		// TODO: We have to add a validator that check if every storage is up to date
		const migrationResult = migrateStoredSnapshot({ storedSnapshot });

		if (migrationResult.isValid) {
			const migratedStoredSnapshot = migrationResult.storedSnapshot;

			return { type: "snapshot", storedSnapshot: migratedStoredSnapshot };
		}

		console.warn("Snapshot migration failed.", migrationResult.reason);
	}

	const rootEditable = createRootEditable({
		customStorage: createRootStorage(),
		display: "block multi-line",
		contentLineLocalNamesStyle: getDefaultContentLineLocalNamesStyles(),
		childNodes: [
			createContentLine({
				localName: "p",
				childNodes: [createBeamText({})],
			}),
		],
	});

	return { type: "node", node: rootEditable };
};

export const createCore = ({ storedSnapshot }: CreateCoreParams) => {
	const rootEditableFrom = createRootEditableFrom({ storedSnapshot });

	const { editorAPI } = createEditorAPI({
		rootEditableFrom,
		shadowRootOptions: {
			mode: "open",
			serializable: true,
			slotAssignment: "manual",
		},
	});

	editorAPI.host.classList.add("editor-host");

	return { editorAPI };
};
