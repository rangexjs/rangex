import {
	createBeamText,
	createContentLine,
	createEditorAPI,
	createRootEditable,
} from "rich-text-area";
import { createRootStorage } from "#engine-links";
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
		return { type: "snapshot", storedSnapshot };
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
