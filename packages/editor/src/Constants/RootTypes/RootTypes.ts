import type { RootDefinitions, RootType } from "./RootTypes-types";

/*
 * The kinds of document a RootEditable can be. A root's type decides how it's built and what a snapshot's root must
 * match. It's kept in the RootStorage, as the engine's display doesn't tell them apart.
 */
export const rootTypes = {
	richText: "rich-text",
} as const;

/*
 * The state of a root of each type: createRoot builds it with this, and validateRoot matches a snapshot's root against it
 */
export const rootDefinitions = {
	[rootTypes.richText]: {
		display: "block multi-line",
		editState: "true",
		allowedComponents: null,
		allowedContentLineLocalNames: null,
		allowedContentLineStyleAttrNames: null,
		allowedGlyphFormatterStyleAttrNames: null,
		allowedGlyphFormatterInlineTags: null,
	},
} as const satisfies RootDefinitions;

const rootTypeValues: unknown[] = Object.values(rootTypes);

export const isRootType = (value: unknown): value is RootType => rootTypeValues.includes(value);
