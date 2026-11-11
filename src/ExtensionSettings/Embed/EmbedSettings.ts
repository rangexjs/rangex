import type { CreateEmbedAttrValidatorsParams } from "@rangex/rich-text-editor/embed";
import { isEmbedURL, parseAbsoluteURL, toEmbedURL } from "../_Utilities";

type EmbedSrcValidator = NonNullable<
	CreateEmbedAttrValidatorsParams["iframe"]
>["src"];

const maxSrcLength = 4096;

/*
 * An Embed's src is valid if it's an embed URL of one of the allowed sites (see PlatformProviders). In a stored
 * snapshot, a share link of one of them falls back to its embed URL. Any other src is rejected.
 */
const validateEmbedSrc: EmbedSrcValidator = ({ value }) => {
	const url = value.length <= maxSrcLength ? parseAbsoluteURL(value) : null;

	if (!url) {
		return { kind: "reject", reason: "must be a URL of an allowed site" };
	}

	if (isEmbedURL(url)) {
		return null;
	}

	const embedURL = toEmbedURL(url);

	if (embedURL) {
		return {
			kind: "fallback",
			reason: "must be an embed URL",
			value: embedURL,
		};
	}

	return { kind: "reject", reason: "must be a URL of an allowed site" };
};

/**
 * Demo-only allowlist: the sites an Embed may frame in the dev view. A consumer building a real editor writes their
 * own, and passes the same snapshotSchema to createRichTextEditor and validateSnapshot.
 */
export const embedAttrValidators: CreateEmbedAttrValidatorsParams = {
	iframe: {
		src: validateEmbedSrc,
	},
};
