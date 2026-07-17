/**
 * Client-side sanity check before any load attempt — catches input that isn't even shaped
 * like a URL (e.g. a plain word typed into a link field) without a network round-trip.
 */
export const isWellFormedUrl = (value: string): boolean => {
	try {
		new URL(value);
		return true;
	} catch {
		return false;
	}
};
