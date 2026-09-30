import {
	contentLineRole,
	contentLineRoleSelector,
	listRole,
	listRoleSelector,
	snapshotIndexChangeEventType,
} from "@rangex/core";
import {
	codeBlockStorageFallbacks,
	ensureNodeCodeBlockStorage,
} from "#storage";
import type {
	HandleCodeBlockStateParams,
	IsHighlightedParams,
} from "./HandleCodeBlockState-types";

const isHighlighted = ({ language, theme }: IsHighlightedParams) =>
	language !== null && theme !== null;

/*
 * Keeps the port's language/theme in sync with the current code block (including undo/redo) and wires language/theme
 * changes and plain-text export to it, re-highlighting and registering a snapshot boundary on
 * change. Returns a cleanup function.
 *
 * Note: a code block is highlighted only when both a language and a theme are set. The snapshot boundary
 * is skipped when it is unhighlighted both before and after the change, since nothing visibly changes.
 */
export const handleCodeBlockState = ({
	configPort,
	editorAPI,
	codeHighlighter,
}: HandleCodeBlockStateParams) => {
	const syncState = () => {
		const { currentComponent } = configPort;

		if (!currentComponent) {
			return;
		}

		const storage = ensureNodeCodeBlockStorage({
			blockComponent: currentComponent,
			fallbacks: codeBlockStorageFallbacks,
		});

		configPort.updateState({
			language: storage.language,
			theme: storage.theme,
		});
	};

	const unsubscribeCurrentComponentUpdate =
		configPort.onCurrentComponentUpdate(syncState);

	// Undo/redo can restore a different language/theme on the current code block.
	const unsubscribeSnapshotIndexChange = editorAPI.subscribeEditorEvent({
		type: snapshotIndexChangeEventType,
		callback: syncState,
	});

	const unsubscribeLanguageChange = configPort.onChangeLanguage((language) => {
		const currentCodeBlock = configPort.currentComponent;
		if (!currentCodeBlock) {
			return;
		}

		const storage = ensureNodeCodeBlockStorage({
			blockComponent: currentCodeBlock,
			fallbacks: codeBlockStorageFallbacks,
		});

		const hadHighlight = isHighlighted(storage);

		codeHighlighter.update({
			blockComponent: currentCodeBlock,
			language,
			theme: storage.theme,
		});
		configPort.updateState({ language, theme: storage.theme });

		const hasHighlight = isHighlighted({ language, theme: storage.theme });

		if (hadHighlight || hasHighlight) {
			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		}
	});

	const unsubscribeThemeChange = configPort.onChangeTheme((theme) => {
		const currentCodeBlock = configPort.currentComponent;
		if (!currentCodeBlock) {
			return;
		}

		const storage = ensureNodeCodeBlockStorage({
			blockComponent: currentCodeBlock,
			fallbacks: codeBlockStorageFallbacks,
		});

		const hadHighlight = isHighlighted(storage);

		codeHighlighter.update({
			blockComponent: currentCodeBlock,
			language: storage.language,
			theme,
		});
		configPort.updateState({ theme });

		const hasHighlight = isHighlighted({ language: storage.language, theme });

		if (hadHighlight || hasHighlight) {
			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		}
	});

	configPort.registerPlainTextProvider(() => {
		const currentCodeBlock = configPort.currentComponent;

		if (!currentCodeBlock) {
			return [];
		}

		const list = currentCodeBlock.$$querySelector(listRoleSelector);

		if (list?.$$editorRole !== listRole) {
			throw new Error("List's type is invalid.");
		}

		const lines: string[] = [];

		for (const listItem of list.$$children) {
			const contentLine = listItem.$$querySelector(contentLineRoleSelector);

			if (contentLine?.$$editorRole !== contentLineRole) {
				throw new Error("ContentLine's type is invalid.");
			}

			lines.push(
				editorAPI.getPlainText({
					fromNode: contentLine,
					fromOffset: 0,
					toNode: contentLine,
					toOffset: contentLine.$$childNodes.length,
				}),
			);
		}

		return lines;
	});

	return () => {
		unsubscribeCurrentComponentUpdate();
		unsubscribeSnapshotIndexChange();
		unsubscribeLanguageChange();
		unsubscribeThemeChange();
	};
};
