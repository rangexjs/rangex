import type { ImagePort } from "#ports";
import type { BlockPopoverAppearanceHandler } from "../../../BlockPopoverAppearanceHandler";

export interface HandleImagePopoverAppearanceParams {
	imagePort: ImagePort;
	blockPopoverAppearanceHandler: BlockPopoverAppearanceHandler;
}
