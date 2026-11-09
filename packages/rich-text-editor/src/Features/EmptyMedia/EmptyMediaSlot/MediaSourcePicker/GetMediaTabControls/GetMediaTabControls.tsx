import type { MediaType } from "@rangex/editor";
import { Icon, type IconName, type SegmentedControlControls } from "#ui";
import type { MediaTab } from "../MediaSourcePicker-types";

const TabLabel = (icon: IconName, label: string) => (
	<span class="inline-flex items-center gap-1">
		<Icon name={icon} class="size-4" />
		<span class="sr-only md:not-sr-only">{label}</span>
	</span>
);

/*
 * An Upload tab if a supported media type can be a file (every one but embed), and a Link tab.
 */
export const getMediaTabControls = (
	supportedMediaTypes: MediaType[],
): SegmentedControlControls<MediaTab> => {
	const controls: SegmentedControlControls<MediaTab> = [];

	if (supportedMediaTypes.some((type) => type !== "embed")) {
		controls.push({
			id: "upload",
			node: TabLabel("FileArrowUp", "Upload"),
			"aria-label": "Upload",
		});
	}

	controls.push({
		id: "link",
		node: TabLabel("SimpleLink", "Link"),
		"aria-label": "Link",
	});

	return controls;
};
