/*
 * A site whose content can be embedded (e.g. YouTube)
 */
export interface PlatformProvider {
	// Turns one of the site's share links into its embed URL, or returns null if the link isn't one of its own
	toEmbedURL(url: URL): string | null;
	// Whether a URL is one of the site's embed URLs: only those are framed
	isEmbedURL(url: URL): boolean;
}
