// Resolves the relative URLs, so they get the protocol of a regular web page
const baseURL = "https://base.invalid/";

// Can't run script: they only navigate, or open another app (e.g. the mail or phone app)
export const safeProtocols = new Set([
	"http:",
	"https:",
	"ftp:",
	"ftps:",
	"mailto:",
	"tel:",
	"callto:",
	"sms:",
	"cid:",
	"xmpp:",
]);

/**
 * Parses the URL the same way the browser parses it. Returns null if it's invalid.
 */
const parseURL = (url: string): URL | null => {
	// Keep until 2030: URL.parse is only supported since 2024 (Chrome 126, Firefox 126, Safari 18)
	if (!URL.parse) {
		try {
			return new URL(url, baseURL);
		} catch {
			return null;
		}
	}

	return URL.parse(url, baseURL);
};

/**
 * Relative URLs and the protocols in safeProtocols are safe.
 * The URL is parsed the same way the browser parses it, so obfuscated protocols (e.g. "java\tscript:") are caught.
 */
export const isSafeURL = (url: string): boolean => {
	const parsedURL = parseURL(url);

	if (!parsedURL) {
		return false;
	}

	return safeProtocols.has(parsedURL.protocol);
};

/**
 * "data:image/*" URLs are only safe where the browser renders them as an image (e.g. img's src)
 */
export const isDataImageURL = (url: string): boolean => {
	const parsedURL = parseURL(url);

	if (!parsedURL) {
		return false;
	}

	if (parsedURL.protocol !== "data:") {
		return false;
	}

	const mimeType = parsedURL.pathname.toLowerCase();

	return mimeType.startsWith("image/");
};
