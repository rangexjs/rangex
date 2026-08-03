import {
	blockNestedContextName,
	blockNestedContextRoleSelector,
	detachedContextName,
	detachedContextRoleSelector,
	listChildNodesChangeEventType,
} from "rich-text-area";
import { componentsName } from "#ports";
import type { HandleLineNumbersParams } from "./HandleLineNumbers-types";

export const handleLineNumbers = ({ editorAPI }: HandleLineNumbersParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: listChildNodesChangeEventType,
		callback: ({ lists }) => {
			for (const list of lists) {
				const blockNestedContext = list.$$closest(
					blockNestedContextRoleSelector,
				);

				if (blockNestedContext?.$$editorRole !== blockNestedContextName) {
					continue;
				}

				if (blockNestedContext.$$componentName !== componentsName.codeBlock) {
					continue;
				}

				for (let i = 0; i < list.$$children.length; i++) {
					const detachedContext = list.$$children[i].$$querySelector(
						detachedContextRoleSelector,
					);

					if (detachedContext?.$$editorRole !== detachedContextName) {
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
