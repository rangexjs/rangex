import type { RangeXEditor } from "@rangex/editor";

import { createMediaResolveDetail } from "../CreateMediaResolveDetail";
import { type ProbeableMediaType, probeMediaType } from "../ProbeMediaType";
import { validateMediaAttrs } from "../ValidateMediaAttrs";
import type {
	DetectMediaUrlTypeParams,
	DetectMediaUrlTypeResult,
	DetectMediaUrlTypeSettings,
} from "./DetectMediaUrlType-types";

/*
 * The extensions that tell a media file's type. An extension shared by several types (e.g. `ogg`, audio or video) isn't
 * listed: the link is probed instead.
 */
const extensionsByMediaType: Record<ProbeableMediaType, string[]> = {
	image: ["apng", "avif", "bmp", "gif", "ico", "jpeg", "jpg", "png", "svg", "webp"],
	video: ["m4v", "mov", "mp4", "ogv", "webm"],
	audio: ["aac", "flac", "m4a", "mp3", "oga", "opus", "wav"],
};

const mediaTypeEntries = Object.entries(extensionsByMediaType) as [ProbeableMediaType, string[]][];

const mediaTypeByExtension = new Map<string, ProbeableMediaType>();

for (const [type, extensions] of mediaTypeEntries) {
	for (const extension of extensions) {
		mediaTypeByExtension.set(extension, type);
	}
}

/*
 * Returns the media type the extension of the URL's last path segment tells, or null if it tells none. The query and
 * the hash aren't part of the path, so they're ignored. E.g.:
 * - `https://example.com/photos/cat.PNG?w=200` → "image"
 * - `https://example.com/song.mp3#t=30` → "audio"
 * - `https://example.com/clip.ogg` → null (`ogg` isn't listed, see extensionsByMediaType)
 * - `https://images.example.com/photo-123?fm=jpg` → null (no extension)
 * - `https://www.youtube.com/watch?v=abc` → null (no extension)
 */
const getMediaTypeByExtension = (url: string): ProbeableMediaType | null => {
	const parsedUrl = URL.parse(url);

	if (!parsedUrl) {
		return null;
	}

	const fileName = parsedUrl.pathname.split("/").at(-1) ?? "";
	const dotIndex = fileName.lastIndexOf(".");

	if (dotIndex === -1) {
		return null;
	}

	const extension = fileName.slice(dotIndex + 1).toLowerCase();

	return mediaTypeByExtension.get(extension) ?? null;
};

interface GetEmbedSrcParams {
	editor: RangeXEditor;
	url: string;
	settings: DetectMediaUrlTypeSettings;
}

/*
 * Returns the URL to frame if the link is one Embed accepts (after transformEmbedURL), by its validators, or null.
 */
const getEmbedSrc = ({ editor, url, settings }: GetEmbedSrcParams) => {
	const { transformEmbedURL = (value) => value } = settings;

	const src = transformEmbedURL(url);
	const detail = createMediaResolveDetail({ type: "embed", src, settings });

	return validateMediaAttrs({ editor, detail }) ? src : null;
};

/**
 * Finds which of the supported media types a link is:
 * 1. A media file by its extension, if its type is supported. It isn't checked to load: a link can load on the site the
 *    content is published on but not in the editor (e.g. a host that only allows its own site).
 * 2. An embed, if Embed's validators accept the link (after transformEmbedURL).
 * 3. Whatever it loads as (see probeMediaType), e.g. a media file whose URL has no extension.
 * The link is unknown if it's none of them.
 */
export const detectMediaUrlType = async ({
	editor,
	url,
	supportedMediaTypes,
	settings,
	signal,
}: DetectMediaUrlTypeParams): DetectMediaUrlTypeResult => {
	const extensionType = getMediaTypeByExtension(url);

	if (extensionType && supportedMediaTypes.includes(extensionType)) {
		return { status: "found", type: extensionType, src: url };
	}

	if (supportedMediaTypes.includes("embed")) {
		const embedSrc = getEmbedSrc({ editor, url, settings });

		if (embedSrc !== null) {
			return { status: "found", type: "embed", src: embedSrc };
		}
	}

	const probedType = await probeMediaType({
		src: url,
		supportedMediaTypes,
		signal,
	});

	if (probedType === null) {
		return { status: "unknown" };
	}

	return { status: "found", type: probedType, src: url };
};
