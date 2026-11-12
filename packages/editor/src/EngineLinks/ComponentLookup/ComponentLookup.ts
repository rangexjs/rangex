import { type EditorElement, EditorRange, isComponent } from "@rangex/core";

import type {
	ComponentByName,
	ComponentLookup,
	CreateComponentLookupParams,
	CreateComponentLookupResult,
} from "./ComponentLookup-types";

/**
 * Creates a {@link ComponentLookup} — the API for finding the component that contains a range, limited to
 * the given component names. The result is typed as BlockComponent or InlineComponent based on the names.
 *
 * - closest — caller supplies the range's boundary points explicitly.
 * - closestBySelection — the range is the current editor selection.
 *
 * Both return the closest matching ancestor that contains the whole range, or null if there is none.
 */
export const createComponentLookup = ({
	editorAPI,
}: CreateComponentLookupParams): CreateComponentLookupResult => {
	const selection = editorAPI.getEditorSelection();

	const componentLookup: ComponentLookup = {
		closest({ fromNode, fromOffset, toNode, toOffset, components }) {
			const range = new EditorRange({ fromNode, fromOffset, toNode, toOffset });

			let parent: EditorElement | null = range.startText.$$parentElement;

			while (parent) {
				if (isComponent(parent)) {
					const { $$name } = parent;

					const nameMatches = components.some((name) => name === $$name);

					const withinRange = range.isDescendant({
						container: parent,
						start: true,
						end: true,
					});

					if (nameMatches && withinRange) {
						// The name filter guarantees the component type the names map to.
						return parent as ComponentByName<(typeof components)[number]>;
					}
				}

				parent = parent.$$parentElement;
			}

			return null;
		},

		closestBySelection({ components }) {
			const { fromText, fromOffset, toText, toOffset } = selection.getBoundaryPoints();

			return componentLookup.closest({
				fromNode: fromText,
				fromOffset,
				toNode: toText,
				toOffset,
				components,
			});
		},
	};

	return componentLookup;
};
