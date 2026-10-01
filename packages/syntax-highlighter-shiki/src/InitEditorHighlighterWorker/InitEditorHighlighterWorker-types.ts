import type {
	GetHighlightInfoParams,
	HighlightInfo,
} from "@rangex/editor/code-block";
import type { LanguageInput, ThemeInput } from "shiki/types";

export interface InitEditorHighlighterWorkerParams {
	langs: LanguageInput[];
	themes: ThemeInput[];
}

export interface WorkerRequest extends GetHighlightInfoParams {
	id: number;
}

export interface WorkerResponse {
	id: number;
	result: HighlightInfo | null;
}
