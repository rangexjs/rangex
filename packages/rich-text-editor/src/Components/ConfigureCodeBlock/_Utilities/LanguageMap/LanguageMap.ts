import type { CodeBlockLanguage } from "@rangex/rich-text-editor-ui";
import type { BundledLangKeys } from "../../../../Libs";

const labelToShikiLang: Record<CodeBlockLanguage, BundledLangKeys> = {
	TypeScript: "typescript",
	JavaScript: "typescript",
	React: "typescript",
	CSS: "typescript",
	Python: "typescript",
	Java: "typescript",
	C: "typescript",
	"C++": "typescript",
	"C#": "typescript",
	Rust: "typescript",
	Go: "typescript",
	Kotlin: "typescript",
	PHP: "typescript",
	Ruby: "typescript",
	Swift: "typescript",
	Dart: "typescript",
	SQL: "typescript",
	Bash: "typescript",
	Markdown: "typescript",
	HTML: "html",
};

const shikiLangToLabel: Record<BundledLangKeys, CodeBlockLanguage> = {
	typescript: "TypeScript",
	html: "HTML",
	json: "TypeScript",
};

export const toHighlighterLang = (
	language: CodeBlockLanguage,
): BundledLangKeys => labelToShikiLang[language];

export const toUILanguage = (lang: BundledLangKeys): CodeBlockLanguage =>
	shikiLangToLabel[lang];
