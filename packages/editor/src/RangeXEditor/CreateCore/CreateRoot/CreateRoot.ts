import {
	createBeamText,
	createContentLine,
	createRootEditable,
} from "@rangex/core";
import { rootDefinitions } from "#constants";
import { toDOMAttrs } from "#dom-attrs";
import { createRootStorage } from "#storage";
import type { CreateRootParams, CreateRootResult } from "./CreateRoot-types";

const createEmptyLines = () => [
	createContentLine({ localName: "p", childNodes: [createBeamText({})] }),
];

/*
 * Builds a RootEditable by its type (see rootDefinitions), with the type kept in its storage. It has the given
 * attributes and lines, by default none and one empty paragraph. They aren't validated here.
 */
export const createRoot = ({
	type,
	attrs = { root: {} },
	childNodes = createEmptyLines(),
}: CreateRootParams): CreateRootResult => {
	return createRootEditable({
		...rootDefinitions[type],
		customStorage: createRootStorage({ type }),
		domAttrs: toDOMAttrs(attrs.root),
		childNodes,
	});
};
