import type {
	ProbeableMediaType,
	ProbeMediaTypeParams,
	ProbeMediaTypeResult,
} from "./ProbeMediaType-types";

type MediaElementType = Exclude<ProbeableMediaType, "image">;

const defaultTimeoutMs = 15_000;

/*
 * A signal that aborts once any of `signals` does, or once `timeoutMs` elapses.
 */
const createProbeSignal = (
	signals: (AbortSignal | undefined)[],
	timeoutMs: number,
) => {
	const definedSignals = signals.filter((signal) => signal !== undefined);

	return AbortSignal.any([...definedSignals, AbortSignal.timeout(timeoutMs)]);
};

/*
 * Resolves whether `src` loads as an image. Gives up once `probeSignal` aborts.
 */
const loadImage = (src: string, probeSignal: AbortSignal): Promise<boolean> =>
	new Promise((resolve) => {
		if (probeSignal.aborted) {
			resolve(false);
			return;
		}

		const image = document.createElement("img");
		const listenersController = new AbortController();
		const { signal } = listenersController;

		const settle = (loaded: boolean) => {
			listenersController.abort();
			resolve(loaded);
		};

		probeSignal.addEventListener("abort", () => settle(false), { signal });
		image.addEventListener("load", () => settle(true), { signal });
		image.addEventListener("error", () => settle(false), { signal });

		image.src = src;
	});

/*
 * Loads the metadata of `src` in a <video>, which plays a file with sound only too. Resolves "video" if it has a
 * picture, "audio" if it doesn't, or null if it doesn't load. Gives up once `probeSignal` aborts, and stops the download
 * once it settles.
 */
const loadMediaElement = (
	src: string,
	probeSignal: AbortSignal,
): Promise<MediaElementType | null> =>
	new Promise((resolve) => {
		if (probeSignal.aborted) {
			resolve(null);
			return;
		}

		const video = document.createElement("video");
		const listenersController = new AbortController();
		const { signal } = listenersController;

		/*
		 * A media element isn't garbage collected while it's loading, and it can keep buffering past its metadata:
		 * removing its src and reloading it is what stops the download.
		 */
		const settle = (type: MediaElementType | null) => {
			listenersController.abort();
			video.removeAttribute("src");
			video.load();
			resolve(type);
		};

		const onLoadedMetadata = () => {
			settle(video.videoWidth > 0 ? "video" : "audio");
		};

		probeSignal.addEventListener("abort", () => settle(null), { signal });
		video.addEventListener("loadedmetadata", onLoadedMetadata, { signal });
		video.addEventListener("error", () => settle(null), { signal });

		video.preload = "metadata";
		video.src = src;
	});

/*
 * Resolves the first probe's type that isn't null, or null once every probe resolved null.
 */
const findFirstType = (
	probes: Promise<ProbeableMediaType | null>[],
): Promise<ProbeableMediaType | null> =>
	new Promise((resolve) => {
		let pendingCount = probes.length;

		if (!pendingCount) {
			resolve(null);
			return;
		}

		for (const probe of probes) {
			probe.then((type) => {
				pendingCount -= 1;

				if (type !== null) {
					resolve(type);
					return;
				}

				if (!pendingCount) {
					resolve(null);
				}
			});
		}
	});

/**
 * Finds which of the supported media types `src` loads as: it's loaded as an image and in a <video> at once, and the
 * <video> tells a video (it has a picture) from an audio. Resolves null if it loads as none of them, `signal` aborts or
 * `timeoutMs` elapses first. The other probe is stopped once one of them finds the type.
 */
export const probeMediaType = async ({
	src,
	supportedMediaTypes,
	signal,
	timeoutMs = defaultTimeoutMs,
}: ProbeMediaTypeParams): ProbeMediaTypeResult => {
	const settledController = new AbortController();
	const probeSignal = createProbeSignal(
		[signal, settledController.signal],
		timeoutMs,
	);

	const probes: Promise<ProbeableMediaType | null>[] = [];

	if (supportedMediaTypes.includes("image")) {
		const imageProbe = loadImage(src, probeSignal).then((loaded) =>
			loaded ? "image" : null,
		);

		probes.push(imageProbe);
	}

	if (
		supportedMediaTypes.includes("video") ||
		supportedMediaTypes.includes("audio")
	) {
		const mediaElementProbe = loadMediaElement(src, probeSignal).then(
			(type) => {
				if (type === null) {
					return null;
				}

				return supportedMediaTypes.includes(type) ? type : null;
			},
		);

		probes.push(mediaElementProbe);
	}

	const type = await findFirstType(probes);

	settledController.abort();

	return type;
};
