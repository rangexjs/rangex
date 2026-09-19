import type {
	CodeBlockLanguageDefinition,
	CodeBlockThemeDefinition,
} from "@rangex/syntax-highlighter-shiki";

/*
 * Single source of truth for every language/theme this demo supports — the worker's highlighter
 * core (`.load`) and the CodeBlock adapter's UI options (`.value`/`.label`) are both derived from
 * this list, so they can't drift apart. Each `load` is a static, literal dynamic import so the
 * bundler only ever emits chunks for what's listed here, not Shiki's full catalog.
 */
export const codeBlockLanguageDefinitions: CodeBlockLanguageDefinition[] = [
	{ value: "bash", label: "Bash", load: () => import("@shikijs/langs/bash") },
	{ value: "c", label: "C", load: () => import("@shikijs/langs/c") },
	{ value: "cpp", label: "C++", load: () => import("@shikijs/langs/cpp") },
	{ value: "csharp", label: "C#", load: () => import("@shikijs/langs/csharp") },
	{ value: "css", label: "CSS", load: () => import("@shikijs/langs/css") },
	{ value: "dart", label: "Dart", load: () => import("@shikijs/langs/dart") },
	{ value: "go", label: "Go", load: () => import("@shikijs/langs/go") },
	{ value: "html", label: "HTML", load: () => import("@shikijs/langs/html") },
	{ value: "java", label: "Java", load: () => import("@shikijs/langs/java") },
	{
		value: "javascript",
		label: "JavaScript",
		load: () => import("@shikijs/langs/javascript"),
	},
	{ value: "json", label: "JSON", load: () => import("@shikijs/langs/json") },
	{
		value: "kotlin",
		label: "Kotlin",
		load: () => import("@shikijs/langs/kotlin"),
	},
	{
		value: "markdown",
		label: "Markdown",
		load: () => import("@shikijs/langs/markdown"),
	},
	{ value: "php", label: "PHP", load: () => import("@shikijs/langs/php") },
	{
		value: "python",
		label: "Python",
		load: () => import("@shikijs/langs/python"),
	},
	{ value: "ruby", label: "Ruby", load: () => import("@shikijs/langs/ruby") },
	{ value: "rust", label: "Rust", load: () => import("@shikijs/langs/rust") },
	{ value: "sql", label: "SQL", load: () => import("@shikijs/langs/sql") },
	{
		value: "swift",
		label: "Swift",
		load: () => import("@shikijs/langs/swift"),
	},
	{ value: "tsx", label: "TSX", load: () => import("@shikijs/langs/tsx") },
	{
		value: "typescript",
		label: "TypeScript",
		load: () => import("@shikijs/langs/typescript"),
	},
];

export const codeBlockThemeDefinitions: CodeBlockThemeDefinition[] = [
	{
		value: "catppuccin-mocha",
		label: "Catppuccin Mocha",
		load: () => import("@shikijs/themes/catppuccin-mocha"),
	},
	{
		value: "dark-plus",
		label: "Dark+",
		load: () => import("@shikijs/themes/dark-plus"),
	},
	{
		value: "dracula",
		label: "Dracula",
		load: () => import("@shikijs/themes/dracula"),
	},
	{
		value: "github-dark",
		label: "GitHub Dark",
		load: () => import("@shikijs/themes/github-dark"),
	},
	{
		value: "github-light",
		label: "GitHub Light",
		load: () => import("@shikijs/themes/github-light"),
	},
	{
		value: "light-plus",
		label: "Light+",
		load: () => import("@shikijs/themes/light-plus"),
	},
	{
		value: "monokai",
		label: "Monokai",
		load: () => import("@shikijs/themes/monokai"),
	},
	{ value: "nord", label: "Nord", load: () => import("@shikijs/themes/nord") },
	{
		value: "one-dark-pro",
		label: "One Dark Pro",
		load: () => import("@shikijs/themes/one-dark-pro"),
	},
	{
		value: "solarized-dark",
		label: "Solarized Dark",
		load: () => import("@shikijs/themes/solarized-dark"),
	},
	{
		value: "solarized-light",
		label: "Solarized Light",
		load: () => import("@shikijs/themes/solarized-light"),
	},
	{
		value: "tokyo-night",
		label: "Tokyo Night",
		load: () => import("@shikijs/themes/tokyo-night"),
	},
];
