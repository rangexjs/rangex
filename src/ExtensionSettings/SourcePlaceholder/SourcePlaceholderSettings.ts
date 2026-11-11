import type {
	SourcePlaceholderExtensionSettings,
	UploadMediaFileFn,
} from "@rangex/rich-text-editor/source-placeholder";

import { isEmbedURL, parseAbsoluteURL, toEmbedURL } from "../_Utilities";

// Served by the dev server (see configs/DevUploads)
const devUploadsPath = "/__dev-uploads";

/**
 * Demo-only upload to the dev server, which keeps the file in memory until it stops, and resolves its URL. A consumer
 * building a real editor should replace this with a function that uploads to their own storage and resolves the
 * resulting URL. It's an XMLHttpRequest, as fetch can't report an upload's progress.
 */
const uploadFile: UploadMediaFileFn = ({ file, onProgress, signal }) => {
	return new Promise((resolve) => {
		const request = new XMLHttpRequest();

		request.upload.addEventListener("progress", (event) => {
			if (event.lengthComputable) {
				onProgress(event.loaded / event.total);
			}
		});

		request.addEventListener("load", () => {
			resolve(request.status === 201 ? request.responseText : null);
		});

		request.addEventListener("error", () => {
			resolve(null);
		});

		request.addEventListener("abort", () => {
			resolve(null);
		});

		signal.addEventListener("abort", () => {
			request.abort();
		});

		request.open("POST", devUploadsPath);
		request.setRequestHeader("Content-Type", file.type || "application/octet-stream");
		request.send(file);
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
const embedIframeAttrs: SourcePlaceholderExtensionSettings["embedIframeAttrs"] = {
	title: "Embedded content",
	sandbox:
		"allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation",
	allow: "fullscreen; autoplay; encrypted-media; picture-in-picture; clipboard-write",
	loading: "lazy",
};

export const sourcePlaceholderSettings: SourcePlaceholderExtensionSettings = {
	uploadFile,
	transformEmbedURL,
	embedIframeAttrs,
};
