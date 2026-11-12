import type { ElementView, NodeView } from "@rangex/core";

import type { HighlightCodeFn, ThemedChars } from "#adapters/CodeBlock";
import type { CodeBlockStorage } from "#storage";

export interface HighlightCodeBlocksParams {
	nodeView: NodeView;
	highlightCode: HighlightCodeFn;
}

export interface HighlightCodeBlockParams {
	elementView: ElementView;
	codeBlockStorage: CodeBlockStorage;
	highlightCode: HighlightCodeFn;
}

export interface GetContentLinesParams {
	elementView: ElementView;
}

export type GetContentLinesResult = ElementView[];

export interface GetLineTextParams {
	contentLine: ElementView;
}

export type GetLineTextResult = string;

export interface CreateTokenViewParams {
	themedChars: ThemedChars;
}
