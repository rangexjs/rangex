import type { EmptyMediaExtensionSettings } from "@rangex/rich-text-editor/empty-media";
import { isEmbedURL, parseAbsoluteURL, toEmbedURL } from "../_Utilities";

/**
 * Demo-only stand-in for a real upload — inlines the file as a base64 data URL instead of
 * sending it anywhere. A consumer building a real editor should replace this with a function
 * that uploads to their own storage and resolves the resulting URL.
 */
const uploadFile = ({
	file,
	onProgress,
}: {
	file: File;
	onProgress?: (progress: number) => void;
}): Promise<string | null> => {
	return new Promise((resolve) => {
		const reader = new FileReader();

		reader.onprogress = (event) => {
			if (event.lengthComputable) {
				onProgress?.(event.loaded / event.total);
			}
		};

		reader.onload = () => {
			resolve(reader.result as string);
		};

		reader.onerror = () => {
			resolve(null);
		};

		reader.readAsDataURL(file);
	});
};

/*
 * Turns a pasted embed URL into the one to frame: a share link of an allowed site (see PlatformProviders) into its embed
 * URL, so users can paste the link they'd naturally copy. Any other URL is kept as it is, and Embed's src validator
 * decides.
 */
const transformEmbedURL = (url: string) => {
	const parsedURL = parseAbsoluteURL(url);

	if (!parsedURL || isEmbedURL(parsedURL)) {
		return url;
	}

	return toEmbedURL(parsedURL) ?? url;
};

/*
 * Demo-only policy every Embed is inserted with: the sandbox and the browser features its iframe may use.
 */
const embedIframeAttrs: EmptyMediaExtensionSettings["embedIframeAttrs"] = {
	title: "Embedded content",
	sandbox:
		"allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation",
	allow:
		"fullscreen; autoplay; encrypted-media; picture-in-picture; clipboard-write",
	loading: "lazy",
};

export const emptyMediaSettings: EmptyMediaExtensionSettings = {
	uploadFile,
	transformEmbedURL,
	embedIframeAttrs,
};
