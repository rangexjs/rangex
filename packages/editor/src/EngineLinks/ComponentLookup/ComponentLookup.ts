import {
	getClosestBlockComponent,
	getClosestInlineComponent,
} from "../NodeQuery";
import { getSelectionForwardText } from "./_Utilities";
import type {
	ComponentLookup,
	CreateComponentLookupParams,
	CreateComponentLookupResult,
} from "./ComponentLookup-types";

/**
 * Creates a {@link ComponentLookup} — the API for finding the BlockComponent or InlineComponent
 * that contains a node, limited to the given component names.
 *
 * Each lookup has two variants:
 * - Direct — caller supplies the anchor node explicitly.
 * - BySelection — the anchor node is the forward end of the current editor selection.
 *
 * All of them return the closest matching ancestor, or null if there is none.
 */
export const createComponentLookup = ({
	editorAPI,
}: CreateComponentLookupParams): CreateComponentLookupResult => {
	const componentLookup: ComponentLookup = {
		closestBlock({ fromNode, components }) {
			return getClosestBlockComponent({ fromNode, components });
		},

		closestBlockBySelection({ components }) {
			const fromNode = getSelectionForwardText({ editorAPI });

			return getClosestBlockComponent({ fromNode, components });
		},

		closestInline({ fromNode, components }) {
			return getClosestInlineComponent({ fromNode, components });
		},

		closestInlineBySelection({ components }) {
			const fromNode = getSelectionForwardText({ editorAPI });

			return getClosestInlineComponent({ fromNode, components });
		},
	};

	return componentLookup;
};
