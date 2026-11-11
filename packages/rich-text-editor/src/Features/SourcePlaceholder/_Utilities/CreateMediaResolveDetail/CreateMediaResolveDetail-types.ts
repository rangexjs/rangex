import type { MediaType } from "@rangex/editor";
import type { EmbedAttrs } from "@rangex/editor/embed";

export interface MediaResolveDetailSettings {
	// The iframe's other attributes every Embed is inserted with (e.g. its sandbox)
	embedIframeAttrs?: Omit<EmbedAttrs["iframe"], "src">;
}

export interface CreateMediaResolveDetailParams {
	type: MediaType;
	src: string;
	settings: MediaResolveDetailSettings;
}
