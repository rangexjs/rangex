import {
	contentLineRole,
	contentLineRoleSelector,
	createContentLine,
	createFormattableTexts,
} from "@rangex/core";
import type {
	HandleDisplayTextChangeParams,
	OnChangeDisplayTextCallback,
} from "./HandleDisplayTextChange-types";

/*
 * Registers a callback that replaces the currently open link's content in place, moves the
 * caret to the end of the new content, and registers a snapshot boundary. Returns a cleanup
 * function.
 */
export const handleDisplayTextChange = ({
	configPort,
	editorAPI,
}: HandleDisplayTextChangeParams) => {
	const selection = editorAPI.getEditorSelection();

	const callback: OnChangeDisplayTextCallback = ({ displayText }) => {
		const { currentComponent } = configPort;

		if (!currentComponent) {
			console.warn("handleDisplayTextChange: no link is currently open.");
			return;
		}

		const contentLine = currentComponent.$$querySelector(
			contentLineRoleSelector,
		);

		if (contentLine?.$$editorRole !== contentLineRole) {
			throw new Error("Link is missing its ContentLine.");
		}

		const createdContentLine = createContentLine({
			localName: "span",
			childNodes: [...createFormattableTexts({ data: displayText })],
		});

		contentLine.$$replaceWith(createdContentLine);

		selection.setBoundaryPoints({
			fromNode: createdContentLine,
			fromOffset: createdContentLine.$$childNodes.length,
			toNode: createdContentLine,
			toOffset: createdContentLine.$$childNodes.length,
		});

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();

		editorAPI.focus();
	};

	const unsubscribe = configPort.onChangeDisplayText(callback);

	return () => {
		unsubscribe();
	};
};
