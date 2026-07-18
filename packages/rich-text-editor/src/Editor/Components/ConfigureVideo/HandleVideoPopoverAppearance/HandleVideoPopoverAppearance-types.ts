import type { VideoPort } from "#ports";
import type { BlockPopoverAppearanceHandler } from "../../../BlockPopoverAppearanceHandler";

export interface HandleVideoPopoverAppearanceParams {
	videoPort: VideoPort;
	blockPopoverAppearanceHandler: BlockPopoverAppearanceHandler;
}
