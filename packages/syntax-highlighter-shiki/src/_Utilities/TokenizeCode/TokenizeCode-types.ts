import type { GetHighlightInfoParams, HighlightInfo } from "@rangex/editor";
import type { HighlighterCore } from "shiki/core";

export interface TokenizeCodeParams extends GetHighlightInfoParams {
	highlighter: HighlighterCore;
}

export interface TokenizeCodeResult extends HighlightInfo {}
