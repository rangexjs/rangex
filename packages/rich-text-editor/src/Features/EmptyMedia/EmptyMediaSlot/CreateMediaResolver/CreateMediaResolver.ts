import type { MediaType } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import {
	createMediaResolveDetail,
	isWellFormedUrl,
	probeMediaSrc,
	validateMediaAttrs,
} from "../../_Utilities";
import type { SlotStatus } from "../EmptyMediaSlot-types";
import type {
	CreateMediaResolverParams,
	CreateMediaResolverResult,
} from "./CreateMediaResolver-types";

/*
 * Takes a capture from a URL or a file down to `emptyMedia.resolve`, which replaces the placeholder: a file is uploaded
 * first (see uploadFile), then the capture is validated and checked that it loads (not for an embed). Holds the status
 * of the attempt. The upload is aborted once the placeholder is removed (the slot is disposed with it).
 */
export const createMediaResolver = ({
	editor,
	emptyMedia,
	container,
	settings,
}: CreateMediaResolverParams): CreateMediaResolverResult => {
	const [status, setStatus] = createSignal<SlotStatus>({ status: "idle" });

	const abortController = new AbortController();

	onCleanup(() => {
		abortController.abort();
	});

	/*
	 * Uploads the file, reporting its progress. Returns the uploaded file's URL, or null if it couldn't be uploaded or
	 * the slot was disposed meanwhile.
	 */
	const uploadMediaFile = async (file: File) => {
		const { signal } = abortController;

		setStatus({ status: "uploading", progress: 0 });

		const src = await settings
			.uploadFile({
				file,
				signal,
				onProgress: (progress) => {
					setStatus({ status: "uploading", progress });
				},
			})
			.catch(() => null);

		if (signal.aborted) {
			return null;
		}

		if (!src) {
			setStatus({
				status: "error",
				message: "Couldn't upload that file. Try a different one.",
			});
			return null;
		}

		return src;
	};

	/*
	 * Resolves a capture down to the media element's src: a file is uploaded, and a typed URL is transformed if it's an
	 * embed's (see transformEmbedURL), then it must be well-formed. An uploaded file's URL isn't checked: it comes from
	 * uploadFile, and it can be a relative one. Returns null if there's no valid src.
	 */
	const resolveSrc = async (type: MediaType, src: string | File) => {
		if (typeof src !== "string") {
			return uploadMediaFile(src);
		}

		const { transformEmbedURL = (url) => url } = settings;

		const url = type === "embed" ? transformEmbedURL(src) : src;

		if (!isWellFormedUrl(url)) {
			setStatus({ status: "error", message: "Enter a valid URL." });
			return null;
		}

		return url;
	};

	const resolve = async (type: MediaType, src: string | File) => {
		const mediaSrc = await resolveSrc(type, src);

		if (mediaSrc === null) {
			return;
		}

		const detail = createMediaResolveDetail({ type, src: mediaSrc, settings });

		if (!validateMediaAttrs({ editor, detail })) {
			const message =
				detail.type === "embed"
					? "This site can't be embedded."
					: `This ${detail.type} can't be inserted.`;

			setStatus({ status: "error", message });
			return;
		}

		// An embed can't be probed: it's a page, not a media file
		if (detail.type !== "embed") {
			setStatus({ status: "checking" });

			const loaded = await probeMediaSrc({
				type: detail.type,
				src: mediaSrc,
			});

			if (abortController.signal.aborted) {
				return;
			}

			if (!loaded) {
				setStatus({
					status: "error",
					message: `Couldn't load that ${detail.type}. Check the link and try again.`,
				});
				return;
			}
		}

		emptyMedia.resolve({ element: container, detail });
	};

	return { status, resolve };
};
