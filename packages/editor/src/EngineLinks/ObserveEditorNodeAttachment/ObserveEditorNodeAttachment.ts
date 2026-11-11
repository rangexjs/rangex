import { type EditorNode, isEditorNode } from "@rangex/core";

import type { ObserveEditorNodeAttachmentParams } from "./ObserveEditorNodeAttachment-types";

export const observeEditorNodeAttachment = ({
	editorAPI,
	onMutation,
}: ObserveEditorNodeAttachmentParams) => {
	const { rootEditable } = editorAPI;

	const observer = new MutationObserver((entries) => {
		const nodes = entries.flatMap(({ addedNodes, removedNodes }) => [
			...addedNodes,
			...removedNodes,
		]);

		const editorNodes = nodes.filter(isEditorNode);

		const mutatedNodes = new Set<EditorNode>(editorNodes);

		const attachedNodes = [];
		const detachedNodes = [];

		for (const node of mutatedNodes) {
			if (rootEditable.contains(node)) {
				attachedNodes.push(node);
			} else {
				detachedNodes.push(node);
			}
		}

		onMutation({ attachedNodes, detachedNodes });
	});

	observer.observe(rootEditable, { childList: true, subtree: true });

	return () => {
		observer.disconnect();
	};
};
