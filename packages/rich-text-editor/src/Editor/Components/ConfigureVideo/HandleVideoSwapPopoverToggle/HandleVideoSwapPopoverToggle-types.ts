import type { BlockNestedContext } from "rich-text-area";
import type { VideoPort } from "#ports";
import type { VideoInternals } from "../ConfigureVideo-types";

export interface HandleVideoSwapPopoverToggleParams {
	videoPort: VideoPort;
	getCurrentBlock: () => BlockNestedContext | null;
	internals: VideoInternals;
}
