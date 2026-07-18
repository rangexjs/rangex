import type { CodeBlockPort } from "#ports";
import type { BlockPopoverAppearanceHandler } from "../../../BlockPopoverAppearanceHandler";

export interface HandleCodeBlockPopoverAppearanceParams {
	codeBlockPort: CodeBlockPort;
	blockPopoverAppearanceHandler: BlockPopoverAppearanceHandler;
}
