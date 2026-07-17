import type {
	ProbeableMediaType,
	ProbeMediaSrcParams,
	ProbeMediaSrcResult,
} from "./ProbeMediaSrc-types";

const defaultTimeoutMs = 15_000;

const probeImage = (src: string): Promise<boolean> =>
	new Promise((resolve) => {
		const image = new Image();

		image.onload = () => resolve(true);
		image.onerror = () => resolve(false);
		image.src = src;
	});

const probeMediaElement = (
	type: Exclude<ProbeableMediaType, "image">,
	src: string,
): Promise<boolean> =>
	new Promise((resolve) => {
		const element = document.createElement(type);

		element.preload = "metadata";
		element.onloadedmetadata = () => resolve(true);
		element.onerror = () => resolve(false);
		element.src = src;
	});

/**
 * Attempts to load `src` as the given media type, resolving `true` on success or `false` if
 * it fails to load or `timeoutMs` elapses first. No `"embed"` case: that content can't be
 * verified this way, so callers must gate on type themselves.
 */
export const probeMediaSrc = ({
	type,
	src,
	timeoutMs = defaultTimeoutMs,
}: ProbeMediaSrcParams): ProbeMediaSrcResult => {
	const attempt = {
		image: () => probeImage(src),
		video: () => probeMediaElement("video", src),
		audio: () => probeMediaElement("audio", src),
	}[type]();

	const timeout = new Promise<boolean>((resolve) => {
		setTimeout(() => resolve(false), timeoutMs);
	});

	return Promise.race([attempt, timeout]);
};
