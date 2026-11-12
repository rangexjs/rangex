import type { MediaType } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";

import {
	createMediaResolveDetail,
	detectMediaUrlType,
	isWellFormedUrl,
	type MediaFileType,
	validateMediaAttrs,
} from "../../_Utilities";
import type { SlotStatus } from "../SourcePlaceholderSlot-types";
import type {
	CreateMediaResolverParams,
	CreateMediaResolverResult,
} from "./CreateMediaResolver-types";

const mediaTypeNouns: Record<MediaType, string> = {
	image: "an image",
	video: "a video",
	audio: "an audio file",
	embed: "an embeddable page",
};

const listFormat = new Intl.ListFormat("en", {
	style: "long",
	type: "disjunction",
});

/*
 * The error of a link that's none of the supported media types, listing them.
 */
const createUnknownLinkMessage = (supportedMediaTypes: MediaType[]) => {
	const nouns = supportedMediaTypes.map((type) => mediaTypeNouns[type]);

	return `Couldn't find ${listFormat.format(nouns)} at that link.`;
};

/*
 * Takes a capture from a file or a link down to `sourcePlaceholder.resolve`, which replaces the placeholder: a file is uploaded
 * first (see uploadMediaFile), and a link's media type is detected (see detectMediaUrlType). The media's attributes must
 * be valid. Holds the status of the attempt. The upload and the detection are aborted once the placeholder is removed
 * (the slot is disposed with it).
 */
export const createMediaResolver = ({
	editor,
	sourcePlaceholder,
	container,
	settings,
}: CreateMediaResolverParams): CreateMediaResolverResult => {
	const [status, setStatus] = createSignal<SlotStatus>({ status: "idle" });

	const abortController = new AbortController();
	const { signal } = abortController;

	onCleanup(() => {
		abortController.abort();
	});

	/*
	 * Uploads the file, reporting its progress. Returns the uploaded file's URL, or null if it couldn't be uploaded or
	 * the slot was disposed meanwhile.
	 */
	const uploadMediaFile = async (file: File) => {
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
	 * Replaces the placeholder with the media, if its attributes are valid.
	 */
	const insertMedia = (type: MediaType, src: string) => {
		const detail = createMediaResolveDetail({ type, src, settings });

		if (!validateMediaAttrs({ editor, detail })) {
			const message =
				detail.type === "embed"
					? "This site can't be embedded."
					: `This ${detail.type} can't be inserted.`;

			setStatus({ status: "error", message });
			return;
		}

		sourcePlaceholder.resolve({ element: container, detail });
	};

	/*
	 * An uploaded file's URL isn't checked: it comes from uploadFile, and it can be a relative one.
	 */
	const resolveFile = async (type: MediaFileType, file: File) => {
		const src = await uploadMediaFile(file);

		if (src === null) {
			return;
		}

		insertMedia(type, src);
	};

	const resolveUrl = async (url: string) => {
		if (!isWellFormedUrl(url)) {
			setStatus({ status: "error", message: "Enter a valid URL." });
			return;
		}

		setStatus({ status: "checking" });

		const detection = await detectMediaUrlType({
			editor,
			url,
			supportedMediaTypes: sourcePlaceholder.supportedMediaTypes,
			settings,
			signal,
		});

		if (signal.aborted) {
			return;
		}

		if (detection.status === "unknown") {
			setStatus({
				status: "error",
				message: createUnknownLinkMessage(sourcePlaceholder.supportedMediaTypes),
			});
			return;
		}

		insertMedia(detection.type, detection.src);
	};

	return { status, resolveFile, resolveUrl };
};
