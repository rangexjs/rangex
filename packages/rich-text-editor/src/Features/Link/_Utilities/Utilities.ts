export const allowedPrefixes = [
	"https://",
	"http://",
	"mailto:",
	"tel:",
	"/",
	"./",
	"../",
	"?",
	"#",
];

/**
 * Sanitizes a URL before it's used as a live `href` — only http(s)/mailto/tel schemes and
 * safe relative paths are let through, blocking anything else (e.g. `javascript:`).
 */
export const serializeURL = (url: string): string => {
	try {
		const parsed = new URL(url);
		const allowed = ["http:", "https:", "mailto:", "tel:"];
		return allowed.includes(parsed.protocol) ? parsed.href : "";
	} catch {
		return /^[./#?]/.test(url) ? url : "";
	}
};
