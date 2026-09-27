import type { BlockComponent, EditorAPI, HTMLLayout } from "rich-text-area";
import type {
	CaptionConfigPort,
	CaptionPosition,
	CaptionState,
	CurrentComponentConfigPort,
} from "#adapters";

export interface HandleCaptionStateParams {
	port: CaptionConfigPort & CurrentComponentConfigPort<BlockComponent>;
	editorAPI: EditorAPI;
	getFigure: (params: { blockComponent: BlockComponent }) => HTMLLayout;
	getCaption: (params: { figure: HTMLLayout }) => CaptionState;
	setCaptionEnabled: (params: {
		figure: HTMLLayout;
		enabled: boolean;
		position: CaptionPosition;
	}) => void;
	setCaptionPosition: (params: {
		figure: HTMLLayout;
		position: CaptionPosition;
	}) => void;
}
