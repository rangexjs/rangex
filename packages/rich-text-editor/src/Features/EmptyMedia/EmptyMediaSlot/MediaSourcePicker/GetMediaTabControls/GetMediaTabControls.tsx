import type { MediaType } from "@rangex/editor";
import { Icon, type IconName, type SegmentedControlControls } from "#ui";
import type { MediaTab } from "../MediaSourcePicker-types";

const TabLabel = (icon: IconName, label: string) => (
	<span class="inline-flex items-center gap-1">
		<Icon name={icon} class="size-4" />
		<span class="sr-only md:not-sr-only">{label}</span>
	</span>
);

export const getMediaTabControls = (
	supportedMediaTypes: MediaType[],
): SegmentedControlControls<MediaTab> => {
	const controls: SegmentedControlControls<MediaTab> = [];

	if (
		supportedMediaTypes.includes("image") ||
		supportedMediaTypes.includes("video") ||
		supportedMediaTypes.includes("audio")
	) {
		controls.push({
			id: "upload",
			node: TabLabel("FileArrowUp", "Upload"),
			"aria-label": "Upload",
		});
	}

	if (supportedMediaTypes.includes("image")) {
		controls.push({
			id: "image",
			node: TabLabel("FileImage", "Image"),
			"aria-label": "Image",
		});
	}

	if (supportedMediaTypes.includes("video")) {
		controls.push({
			id: "video",
			node: TabLabel("FileVideo", "Video"),
			"aria-label": "Video",
		});
	}

	if (supportedMediaTypes.includes("audio")) {
		controls.push({
			id: "audio",
			node: TabLabel("FileAudio", "Audio"),
			"aria-label": "Audio",
		});
	}

	if (supportedMediaTypes.includes("embed")) {
		controls.push({
			id: "embed",
			node: TabLabel("FileCloud", "Embed"),
			"aria-label": "Embed",
		});
	}

	if (!controls.length) {
		throw new Error("No tabs available for the supported media types.");
	}

	return controls;
};
