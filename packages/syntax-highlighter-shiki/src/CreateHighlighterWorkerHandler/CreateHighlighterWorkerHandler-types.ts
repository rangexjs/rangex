import type { GetHighlightInfoParams, HighlightInfo } from "@rangex/editor";
import type { LanguageInput, ThemeInput } from "@shikijs/types";

export interface CreateHighlighterWorkerHandlerParams {
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
