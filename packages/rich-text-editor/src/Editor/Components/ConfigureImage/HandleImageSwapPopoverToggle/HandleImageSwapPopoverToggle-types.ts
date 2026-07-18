import type { BlockNestedContext } from "rich-text-area";
import type { ImagePort } from "#ports";
import type { ImageInternals } from "../ConfigureImage-types";

export interface HandleImageSwapPopoverToggleParams {
	imagePort: ImagePort;
	getCurrentBlock: () => BlockNestedContext | null;
	internals: ImageInternals;
}
