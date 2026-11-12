import type { MediaType, RangeXEditor } from "@rangex/editor";

import type { MediaResolveDetailSettings } from "../CreateMediaResolveDetail";

export interface DetectMediaUrlTypeSettings extends MediaResolveDetailSettings {
	/*
	 * Turns a pasted link into the URL to frame if it's one of an embed (e.g. a share link into its embed URL). Every
	 * link that isn't a media file by its extension goes through it, so any other link must be returned as it is.
	 */
	transformEmbedURL?: (url: string) => string;
}

export interface DetectMediaUrlTypeParams {
	editor: RangeXEditor;
	url: string;
	supportedMediaTypes: MediaType[];
	settings: DetectMediaUrlTypeSettings;
	signal?: AbortSignal;
}

interface FoundMediaUrl {
	status: "found";
	type: MediaType;
	// The URL to insert: the transformed one for an embed
	src: string;
}

export type MediaUrlDetection = FoundMediaUrl | { status: "unknown" };

export type DetectMediaUrlTypeResult = Promise<MediaUrlDetection>;
