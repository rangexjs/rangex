import type {
	TransformEmbedUrlParams,
	TransformEmbedUrlResult,
} from "./TransformEmbedUrl-types";

type EmbedProvider = (url: URL) => string | null;

const stripWWW = (hostname: string) => hostname.replace(/^www\./, "");

const youtubeProvider: EmbedProvider = (url) => {
	const host = stripWWW(url.hostname);

	if (host === "youtube.com") {
		if (url.pathname === "/watch") {
			const id = url.searchParams.get("v");
			return id ? `https://www.youtube.com/embed/${id}` : null;
		}

		const shortsMatch = url.pathname.match(/^\/shorts\/([^/]+)/);
		return shortsMatch
			? `https://www.youtube.com/embed/${shortsMatch[1]}`
			: null;
	}

	if (host === "youtu.be") {
		const id = url.pathname.slice(1);
		return id ? `https://www.youtube.com/embed/${id}` : null;
	}

	return null;
};

const spotifyProvider: EmbedProvider = (url) => {
	if (stripWWW(url.hostname) !== "open.spotify.com") {
		return null;
	}

	const match = url.pathname.match(
		/^\/(track|album|playlist|episode|show)\/([^/]+)/,
	);

	return match
		? `https://open.spotify.com/embed/${match[1]}/${match[2]}`
		: null;
};

const vimeoProvider: EmbedProvider = (url) => {
	if (stripWWW(url.hostname) !== "vimeo.com") {
		return null;
	}

	const match = url.pathname.match(/^\/(\d+)/);

	return match ? `https://player.vimeo.com/video/${match[1]}` : null;
};

const embedProviders: EmbedProvider[] = [
	youtubeProvider,
	spotifyProvider,
	vimeoProvider,
];

/**
 * Rewrites a share-page URL (e.g. a YouTube watch link) into its embeddable form, so users
 * can paste the link they'd naturally copy instead of needing to already know the `/embed/`
 * variant. A URL that doesn't match any known provider shape is returned unchanged.
 */
export const transformEmbedUrl = ({
	url,
}: TransformEmbedUrlParams): TransformEmbedUrlResult => {
	const parsed = new URL(url);

	for (const provider of embedProviders) {
		const transformed = provider(parsed);

		if (transformed) {
			return transformed;
		}
	}

	return url;
};
