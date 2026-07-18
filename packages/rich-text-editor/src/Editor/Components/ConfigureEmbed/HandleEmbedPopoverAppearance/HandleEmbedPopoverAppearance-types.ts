import type { EmbedPort } from "#ports";
import type { BlockPopoverAppearanceHandler } from "../../../BlockPopoverAppearanceHandler";

export interface HandleEmbedPopoverAppearanceParams {
	embedPort: EmbedPort;
	blockPopoverAppearanceHandler: BlockPopoverAppearanceHandler;
}
