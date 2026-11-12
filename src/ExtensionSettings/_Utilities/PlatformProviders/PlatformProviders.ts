import type { PlatformProvider } from "./PlatformProviders-types";

/*
 * Returns the video id of a YouTube share link: a watch link, a shorts link or a youtu.be link.
 */
const getYoutubeVideoId = ({ hostname, pathname, searchParams }: URL) => {
	if (hostname === "youtu.be") {
		return pathname.slice(1);
	}

	if (!["youtube.com", "www.youtube.com", "m.youtube.com"].includes(hostname)) {
		return null;
	}

	if (pathname === "/watch") {
		return searchParams.get("v");
	}

	return pathname.match(/^\/shorts\/([\w-]+)$/)?.[1] ?? null;
};

const youtubeProvider: PlatformProvider = {
	toEmbedURL: (url) => {
		const id = getYoutubeVideoId(url);

		if (!(id && /^[\w-]+$/.test(id))) {
			return null;
		}

		return `https://www.youtube.com/embed/${id}`;
	},

	isEmbedURL: ({ hostname, pathname }) =>
		["www.youtube.com", "www.youtube-nocookie.com"].includes(hostname) &&
		/^\/embed\/[\w-]+$/.test(pathname),
};

const vimeoProvider: PlatformProvider = {
	toEmbedURL: ({ hostname, pathname }) => {
		if (!["vimeo.com", "www.vimeo.com"].includes(hostname)) {
			return null;
		}

		const id = pathname.match(/^\/(\d+)$/)?.[1];

		return id ? `https://player.vimeo.com/video/${id}` : null;
	},

	isEmbedURL: ({ hostname, pathname }) =>
		hostname === "player.vimeo.com" && /^\/video\/\d+$/.test(pathname),
};

const spotifyProvider: PlatformProvider = {
	toEmbedURL: ({ hostname, pathname }) => {
		if (hostname !== "open.spotify.com") {
			return null;
		}

		const match = pathname.match(/^\/(track|album|playlist|episode|show)\/(\w+)$/);

		return match ? `https://open.spotify.com/embed/${match[1]}/${match[2]}` : null;
	},

	isEmbedURL: ({ hostname, pathname }) =>
		hostname === "open.spotify.com" &&
		/^\/embed\/(track|album|playlist|episode|show)\/\w+$/.test(pathname),
};

const loomProvider: PlatformProvider = {
	toEmbedURL: ({ hostname, pathname }) => {
		if (!["loom.com", "www.loom.com"].includes(hostname)) {
			return null;
		}

		const id = pathname.match(/^\/share\/([\w-]+)$/)?.[1];

		return id ? `https://www.loom.com/embed/${id}` : null;
	},

	isEmbedURL: ({ hostname, pathname }) =>
		hostname === "www.loom.com" && /^\/embed\/[\w-]+$/.test(pathname),
};

/*
 * Returns the video id of a Dailymotion share link: a video link or a dai.ly link.
 */
const getDailymotionVideoId = ({ hostname, pathname }: URL) => {
	if (hostname === "dai.ly") {
		return pathname.match(/^\/(\w+)$/)?.[1] ?? null;
	}

	if (!["dailymotion.com", "www.dailymotion.com"].includes(hostname)) {
		return null;
	}

	return pathname.match(/^\/video\/(\w+)$/)?.[1] ?? null;
};

const dailymotionProvider: PlatformProvider = {
	toEmbedURL: (url) => {
		const id = getDailymotionVideoId(url);

		return id ? `https://www.dailymotion.com/embed/video/${id}` : null;
	},

	isEmbedURL: ({ hostname, pathname }) =>
		hostname === "www.dailymotion.com" && /^\/embed\/video\/\w+$/.test(pathname),
};

const codePenProvider: PlatformProvider = {
	toEmbedURL: ({ hostname, pathname }) => {
		if (hostname !== "codepen.io") {
			return null;
		}

		const match = pathname.match(/^\/([\w-]+)\/pen\/(\w+)$/);

		return match ? `https://codepen.io/${match[1]}/embed/${match[2]}` : null;
	},

	isEmbedURL: ({ hostname, pathname }) =>
		hostname === "codepen.io" && /^\/[\w-]+\/embed\/\w+$/.test(pathname),
};

/*
 * The sites the dev view embeds content of
 */
const platformProviders: PlatformProvider[] = [
	youtubeProvider,
	vimeoProvider,
	spotifyProvider,
	loomProvider,
	dailymotionProvider,
	codePenProvider,
];

/*
 * Parses an absolute URL, returning null if it's invalid or relative.
 */
export const parseAbsoluteURL = (url: string): URL | null => {
	try {
		return new URL(url);
	} catch {
		return null;
	}
};

/*
 * Whether a URL is an https embed URL of one of the providers. A relative URL, or one of any other site, isn't: a page
 * of the app's own site could reach the editor's page through the iframe.
 */
export const isEmbedURL = (url: URL) =>
	url.protocol === "https:" &&
	platformProviders.some((platformProvider) => platformProvider.isEmbedURL(url));

/*
 * Returns the embed URL of a provider's share link (e.g. a YouTube watch link), or null if no provider knows it.
 */
export const toEmbedURL = (url: URL) => {
	for (const platformProvider of platformProviders) {
		const embedURL = platformProvider.toEmbedURL(url);

		if (embedURL) {
			return embedURL;
		}
	}

	return null;
};
