import { componentsName } from "../../ComponentsName";
import type { MediaCaptionDefinition } from "./MediaCaptionDefinition-types";

/*
 * The state of every media caption's NestedEditable (Image, Video, Audio, Embed): each caption is built with this, and
 * a snapshot's caption must match it. It only allows inline components, each listed by name, so a new component stays
 * out until it's added.
 */
export const mediaCaptionDefinition = {
	nestedEditableProps: {
		display: "block single-line",
		editState: "true",
		allowedComponents: [
			componentsName.link,
			componentsName.mention,
			componentsName.templateVariable,
		],
		allowedContentLineLocalNames: null,
		allowedContentLineStyleAttrNames: null,
		allowedGlyphFormatterStyleAttrNames: null,
		allowedGlyphFormatterInlineTags: null,
	},
} satisfies MediaCaptionDefinition;
