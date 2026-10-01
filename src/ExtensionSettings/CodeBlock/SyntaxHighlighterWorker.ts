import { initEditorHighlighterWorker } from "@rangex/syntax-highlighter-shiki";
import {
	codeBlockLanguageDefinitions,
	codeBlockThemeDefinitions,
} from "./CodeBlockSyntaxHighlighting";

initEditorHighlighterWorker({
	langs: codeBlockLanguageDefinitions.map(({ load }) => load),
	themes: codeBlockThemeDefinitions.map(({ load }) => load),
});
