import type { BlockNestedContext, EditorAPI, HTMLLayout } from "rich-text-area";
import type { CaptionPort, CaptionPosition, CaptionState } from "#adapters";

export interface HandleCaptionStateParams {
	port: CaptionPort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockNestedContext | null;
	getFigure: (params: { blockNestedContext: BlockNestedContext }) => HTMLLayout;
	getCaption: (params: { figure: HTMLLayout }) => CaptionState;
	setCaptionEnabled: (params: { figure: HTMLLayout; enabled: boolean }) => void;
	setCaptionPosition: (params: {
		figure: HTMLLayout;
		position: CaptionPosition;
	}) => void;
}
