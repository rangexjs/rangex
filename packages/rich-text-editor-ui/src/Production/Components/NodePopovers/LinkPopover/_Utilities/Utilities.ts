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

export const serializeURL = (url: string): string => {
	try {
		const parsed = new URL(url);
		const allowed = ["http:", "https:", "mailto:", "tel:"];
		return allowed.includes(parsed.protocol) ? parsed.href : "";
	} catch {
		// Relative paths (/, ./, ../, ?, #) are safe — they can't carry a scheme like javascript:
		return /^[./#?]/.test(url) ? url : "";
	}
};
