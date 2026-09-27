import { type Component, EditorRange } from "rich-text-area";
import {
	getClosestBlockComponent,
	getClosestInlineComponent,
} from "../NodeQuery";
import type {
	ComponentLookup,
	CreateComponentLookupParams,
	CreateComponentLookupResult,
	FindContainingComponentParams,
} from "./ComponentLookup-types";

/*
 * Walks the matching ancestor components of the range's start and returns the first one that contains
 * the whole range, or null if there is none.
 */
const findContainingComponent = <TComponent extends Component>({
	range,
	getClosest,
}: FindContainingComponentParams<TComponent>): TComponent | null => {
	let component = getClosest(range.startText);

	while (component) {
		const withinRange = range.isDescendant({
			container: component,
			start: true,
			end: true,
		});

		if (withinRange) {
			return component;
		}

		const { $$parentElement } = component;

		if (!$$parentElement) {
			return null;
		}

		component = getClosest($$parentElement);
	}

	return null;
};

/**
 * Creates a {@link ComponentLookup} — the API for finding the BlockComponent or InlineComponent
 * that contains a range, limited to the given component names.
 *
 * Each lookup has two variants:
 * - Direct — caller supplies the range's boundary points explicitly.
 * - BySelection — the range is the current editor selection.
 *
 * All of them return the closest matching ancestor that contains the whole range, or null if there is none.
 */
export const createComponentLookup = ({
	editorAPI,
}: CreateComponentLookupParams): CreateComponentLookupResult => {
	const selection = editorAPI.getEditorSelection();

	const componentLookup: ComponentLookup = {
		closestBlock({ fromNode, fromOffset, toNode, toOffset, components }) {
			const range = new EditorRange({ fromNode, fromOffset, toNode, toOffset });

			return findContainingComponent({
				range,
				getClosest: (node) =>
					getClosestBlockComponent({ fromNode: node, components }),
			});
		},

		closestBlockBySelection({ components }) {
			const { fromText, fromOffset, toText, toOffset } =
				selection.getBoundaryPoints();

			return componentLookup.closestBlock({
				fromNode: fromText,
				fromOffset,
				toNode: toText,
				toOffset,
				components,
			});
		},

		closestInline({ fromNode, fromOffset, toNode, toOffset, components }) {
			const range = new EditorRange({ fromNode, fromOffset, toNode, toOffset });

			return findContainingComponent({
				range,
				getClosest: (node) =>
					getClosestInlineComponent({ fromNode: node, components }),
			});
		},

		closestInlineBySelection({ components }) {
			const { fromText, fromOffset, toText, toOffset } =
				selection.getBoundaryPoints();

			return componentLookup.closestInline({
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
