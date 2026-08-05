import {
	createBeamText,
	createContentLine,
	createRootEditable,
	defineRangeX,
} from "rich-text-area";
import { createRootStorage } from "#editor";
import { getDefaultContentLineLocalNamesStyles } from "./_Utilities";
import type {
	CreateRangeXParams,
	CreateRootEditableFromParams,
	CreateRootEditableFromResult,
} from "./CreateRangeX-types";

const { RangeX } = defineRangeX({});

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

export const createRangeX = ({ storedSnapshot }: CreateRangeXParams) => {
	const rootEditableFrom = createRootEditableFrom({ storedSnapshot });

	return new RangeX({
		rootEditableFrom,
		shadowRootOptions: {
			mode: "open",
			serializable: true,
			slotAssignment: "manual",
		},
	});
};
