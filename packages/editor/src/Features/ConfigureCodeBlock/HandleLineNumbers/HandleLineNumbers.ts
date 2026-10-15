import {
	blockComponentRole,
	blockComponentRoleSelector,
	detachedContextRole,
	detachedContextRoleSelector,
	listChildNodesChangeEventType,
} from "@rangex/core";
import { componentsName } from "#engine-links";
import type { HandleLineNumbersParams } from "./HandleLineNumbers-types";

/*
 * Keeps each code block's line number gutter in sync with its list items, renumbering
 * the detached line-number text whenever lines are added, removed, or reordered.
 */
export const handleLineNumbers = ({ editorAPI }: HandleLineNumbersParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: listChildNodesChangeEventType,
		callback: ({ lists }) => {
			for (const list of lists.keys()) {
				const blockComponent = list.$$closest(blockComponentRoleSelector);

				if (blockComponent?.$$editorRole !== blockComponentRole) {
					continue;
				}

				if (blockComponent.$$name !== componentsName.codeBlock) {
					continue;
				}

				for (let i = 0; i < list.$$children.length; i++) {
					const detachedContext = list.$$children[i].$$querySelector(
						detachedContextRoleSelector,
					);

					if (detachedContext?.$$editorRole !== detachedContextRole) {
						throw new Error("DetachedContext's type is invalid.");
					}

					const textNode = detachedContext.shadowRoot?.firstChild;

					if (!textNode) {
						throw new Error("DetachedContext's text node is missing.");
					}

					textNode.textContent = `${i + 1}`;
				}
			}
		},
	});

	return () => {
		unsubscribe();
	};
};
