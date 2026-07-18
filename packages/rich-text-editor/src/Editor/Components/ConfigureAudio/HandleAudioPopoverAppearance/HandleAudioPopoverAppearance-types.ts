import type { AudioPort } from "#ports";
import type { BlockPopoverAppearanceHandler } from "../../../BlockPopoverAppearanceHandler";

export interface HandleAudioPopoverAppearanceParams {
	audioPort: AudioPort;
	blockPopoverAppearanceHandler: BlockPopoverAppearanceHandler;
}
