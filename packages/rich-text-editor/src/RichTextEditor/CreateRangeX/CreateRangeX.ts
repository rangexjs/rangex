import {
	createBeamText,
	createContentLine,
	createRootEditable,
	defineRangeX,
} from "rich-text-area";
import { getDefaultContentLineLocalNamesStyles } from "./_Utilities";
import type { CreateRangeXParams } from "./CreateRangeX-types";

const { RangeX } = defineRangeX({});

export const createRangeX = ({ storedSnapshot }: CreateRangeXParams) => {
	return new RangeX({
		rootEditableFrom: storedSnapshot
			? { type: "snapshot", storedSnapshot }
			: {
					type: "node",
					node: createRootEditable({
						display: "block multi-line",
						contentLineLocalNamesStyle: getDefaultContentLineLocalNamesStyles(),
						childNodes: [
							createContentLine({
								localName: "p",
								childNodes: [createBeamText()],
							}),
						],
					}),
				},
		shadowRootOptions: {
			mode: "open",
			serializable: true,
			slotAssignment: "manual",
		},
	});
};
