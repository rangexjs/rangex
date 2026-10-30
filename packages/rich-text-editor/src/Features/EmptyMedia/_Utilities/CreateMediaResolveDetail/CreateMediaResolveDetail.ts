import type { MediaResolveDetail } from "@rangex/editor/empty-media";
import { assertNever } from "#utilities";
import type { CreateMediaResolveDetailParams } from "./CreateMediaResolveDetail-types";

/*
 * Builds every attribute of the media to insert: centered, with the media element's src and its defaults (e.g. an
 * image's object fit, a video's controls). An embed's iframe gets the configured attributes.
 */
export const createMediaResolveDetail = ({
	type,
	src,
	settings,
}: CreateMediaResolveDetailParams): MediaResolveDetail => {
	const line = { "data-block-align": "center" };

	if (type === "image") {
		return {
			type,
			attrs: {
				line,
				block: {},
				img: { src, alt: "", "data-object-fit": "cover" },
			},
		};
	}

	if (type === "video") {
		return {
			type,
			attrs: {
				line,
				block: {},
				video: { src, controls: "", "data-object-fit": "cover" },
			},
		};
	}

	if (type === "audio") {
		return {
			type,
			attrs: { line, block: {}, audio: { src, controls: "" } },
		};
	}

	if (type === "embed") {
		const { embedIframeAttrs = {} } = settings;

		return {
			type,
			attrs: {
				line,
				block: {},
				iframe: { ...embedIframeAttrs, src },
			},
		};
	}

	return assertNever(type);
};
