import { createHighlighterWorkerHandler } from "@rangex/syntax-highlighter-shiki";
import {
	codeBlockLanguageDefinitions,
	codeBlockThemeDefinitions,
} from "./CodeBlockSyntaxHighlighting";

createHighlighterWorkerHandler({
	langs: codeBlockLanguageDefinitions.map(({ load }) => load),
	themes: codeBlockThemeDefinitions.map(({ load }) => load),
});
