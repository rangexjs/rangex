import type { CodeBlockLanguage, CodeBlockTheme } from "#ui";
import type { BundledLangKeys, BundledThemeKeys } from "../../../../Libs";

const labelToShikiLang = {
	TypeScript: "typescript",
	JavaScript: "javascript",
	React: "tsx",
	CSS: "css",
	Python: "python",
	Java: "java",
	C: "c",
	"C++": "cpp",
	"C#": "csharp",
	Rust: "rust",
	Go: "go",
	Kotlin: "kotlin",
	PHP: "php",
	Ruby: "ruby",
	Swift: "swift",
	Dart: "dart",
	SQL: "sql",
	Bash: "bash",
	Markdown: "markdown",
	HTML: "html",
	JSON: "json",
} satisfies Record<CodeBlockLanguage, BundledLangKeys>;

const shikiLangToLabel = {
	typescript: "TypeScript",
	javascript: "JavaScript",
	tsx: "React",
	css: "CSS",
	python: "Python",
	java: "Java",
	c: "C",
	cpp: "C++",
	csharp: "C#",
	rust: "Rust",
	go: "Go",
	kotlin: "Kotlin",
	php: "PHP",
	ruby: "Ruby",
	swift: "Swift",
	dart: "Dart",
	sql: "SQL",
	bash: "Bash",
	markdown: "Markdown",
	html: "HTML",
	json: "JSON",
} satisfies Record<BundledLangKeys, CodeBlockLanguage>;

export const toHighlighterLang = (
	language: CodeBlockLanguage,
): BundledLangKeys | null => {
	if (!(language in labelToShikiLang)) {
		return null;
	}
	return labelToShikiLang[language as keyof typeof labelToShikiLang];
};

export const toUILanguage = (lang: BundledLangKeys): CodeBlockLanguage =>
	shikiLangToLabel[lang];

const shikiThemeToLabel = {
	"catppuccin-mocha": "Catppuccin Mocha",
	"dark-plus": "Dark+",
	dracula: "Dracula",
	"github-dark": "GitHub Dark",
	"github-light": "GitHub Light",
	"light-plus": "Light+",
	monokai: "Monokai",
	nord: "Nord",
	"one-dark-pro": "One Dark Pro",
	"solarized-dark": "Solarized Dark",
	"solarized-light": "Solarized Light",
	"tokyo-night": "Tokyo Night",
} satisfies Record<BundledThemeKeys, CodeBlockTheme>;

const labelToShikiTheme = {
	"Catppuccin Mocha": "catppuccin-mocha",
	"Dark+": "dark-plus",
	Dracula: "dracula",
	"GitHub Dark": "github-dark",
	"GitHub Light": "github-light",
	"Light+": "light-plus",
	Monokai: "monokai",
	Nord: "nord",
	"One Dark Pro": "one-dark-pro",
	"Solarized Dark": "solarized-dark",
	"Solarized Light": "solarized-light",
	"Tokyo Night": "tokyo-night",
} satisfies Record<CodeBlockTheme, BundledThemeKeys>;

export const toUITheme = (theme: BundledThemeKeys): CodeBlockTheme =>
	shikiThemeToLabel[theme];

export const toHighlighterTheme = (
	label: CodeBlockTheme,
): BundledThemeKeys | null => {
	if (!(label in labelToShikiTheme)) {
		return null;
	}
	return labelToShikiTheme[label as keyof typeof labelToShikiTheme];
};
