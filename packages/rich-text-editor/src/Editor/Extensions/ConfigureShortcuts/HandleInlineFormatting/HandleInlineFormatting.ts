import type {
	GlyphFormatterInlineTag,
	RangeFormatGlyphFormatterInlineTags,
	TextFormatInlineTags,
} from "rich-text-area";
import { selectionStylesChangeEventType } from "rich-text-area";
import type {
	HandleInlineFormattingParams,
	InlineFormattingShortcut,
} from "./HandleInlineFormatting-types";

const inlineFormattingShortcuts: InlineFormattingShortcut[] = [
	{ code: "KeyB", shiftKey: false, tag: "b" },
	{ code: "KeyI", shiftKey: false, tag: "i" },
	{ code: "KeyU", shiftKey: false, tag: "u" },
	{ code: "KeyS", shiftKey: true, tag: "s" },
	{ code: "KeyE", shiftKey: false, tag: "code" },
];

const matchInlineFormattingShortcut = (
	event: KeyboardEvent,
): GlyphFormatterInlineTag | null => {
	if (!(event.ctrlKey || event.metaKey)) {
		return null;
	}

	const shortcut = inlineFormattingShortcuts.find(
		({ code, shiftKey }) => event.code === code && event.shiftKey === shiftKey,
	);

	return shortcut?.tag ?? null;
};

/**
 * Toggles bold/italic/underline/strikethrough/code on Ctrl/Cmd(+Shift)+letter. Reads the tag's
 * current state off the RangeFormat cached from selectionStylesChange rather than tracking its
 * own copy of the selection's formatting. In caret mode (collapsed selection), a pending toggle
 * lives in `textFormatInlineTagsState` and overrides the RangeFormat's `state` until the next
 * glyph is typed, so it takes precedence when present.
 */
export const handleInlineFormatting = ({
	editorAPI,
}: HandleInlineFormattingParams) => {
	let rangeFormat: RangeFormatGlyphFormatterInlineTags | null = null;
	let textFormatInlineTagsState: TextFormatInlineTags | null = null;

	const unsubscribeSelectionStylesChange = editorAPI.subscribeEditorEvent({
		type: selectionStylesChangeEventType,
		callback: ({ selectionFormatStyles }) => {
			rangeFormat = selectionFormatStyles.glyphFormatterInlineTags;
			textFormatInlineTagsState =
				selectionFormatStyles.textFormatInlineTagsState;
		},
	});

	const unregisterKeydown = editorAPI.registerEventInterceptor({
		type: "keydown",
		interceptor: (event) => {
			const tag = matchInlineFormattingShortcut(event);

			if (!tag) {
				return false;
			}

			if (!rangeFormat) {
				return false;
			}

			const { state, permission } = rangeFormat[tag];

			if (permission === "not-allowed") {
				return false;
			}

			const caretState = textFormatInlineTagsState?.[tag];
			const applied = caretState ?? state === "applied";

			editorAPI.updateSelectionStyles({
				inlineTags: { [tag]: !applied },
			});

			editorAPI.focus();

			return true;
		},
	});

	return () => {
		unsubscribeSelectionStylesChange();
		unregisterKeydown();
	};
};
