import type {
	CodeBlockLanguageDefinition,
	CodeBlockThemeDefinition,
} from "@rangex/syntax-highlighter-shiki";

/*
 * Single source of truth for every language/theme this demo supports — the worker's highlighter
 * core (`.load`) and the CodeBlock adapter's UI options (`.id`/`.label`) are both derived from
 * this list, so they can't drift apart. Each `load` is a static, literal dynamic import so the
 * bundler only ever emits chunks for what's listed here, not Shiki's full catalog.
 */
export const codeBlockLanguageDefinitions: CodeBlockLanguageDefinition[] = [
	{ id: "bash", label: "Bash", load: () => import("@shikijs/langs/bash") },
	{ id: "c", label: "C", load: () => import("@shikijs/langs/c") },
	{ id: "cpp", label: "C++", load: () => import("@shikijs/langs/cpp") },
	{ id: "csharp", label: "C#", load: () => import("@shikijs/langs/csharp") },
	{ id: "css", label: "CSS", load: () => import("@shikijs/langs/css") },
	{ id: "dart", label: "Dart", load: () => import("@shikijs/langs/dart") },
	{ id: "go", label: "Go", load: () => import("@shikijs/langs/go") },
	{ id: "html", label: "HTML", load: () => import("@shikijs/langs/html") },
	{ id: "java", label: "Java", load: () => import("@shikijs/langs/java") },
	{
		id: "javascript",
		label: "JavaScript",
		load: () => import("@shikijs/langs/javascript"),
	},
	{ id: "json", label: "JSON", load: () => import("@shikijs/langs/json") },
	{
		id: "kotlin",
		label: "Kotlin",
		load: () => import("@shikijs/langs/kotlin"),
	},
	{
		id: "markdown",
		label: "Markdown",
		load: () => import("@shikijs/langs/markdown"),
	},
	{ id: "php", label: "PHP", load: () => import("@shikijs/langs/php") },
	{
		id: "python",
		label: "Python",
		load: () => import("@shikijs/langs/python"),
	},
	{ id: "ruby", label: "Ruby", load: () => import("@shikijs/langs/ruby") },
	{ id: "rust", label: "Rust", load: () => import("@shikijs/langs/rust") },
	{ id: "sql", label: "SQL", load: () => import("@shikijs/langs/sql") },
	{ id: "swift", label: "Swift", load: () => import("@shikijs/langs/swift") },
	{ id: "tsx", label: "TSX", load: () => import("@shikijs/langs/tsx") },
	{
		id: "typescript",
		label: "TypeScript",
		load: () => import("@shikijs/langs/typescript"),
	},
];

export const codeBlockThemeDefinitions: CodeBlockThemeDefinition[] = [
	{
		id: "catppuccin-mocha",
		label: "Catppuccin Mocha",
		load: () => import("@shikijs/themes/catppuccin-mocha"),
	},
	{
		id: "dark-plus",
		label: "Dark+",
		load: () => import("@shikijs/themes/dark-plus"),
	},
	{
		id: "dracula",
		label: "Dracula",
		load: () => import("@shikijs/themes/dracula"),
	},
	{
		id: "github-dark",
		label: "GitHub Dark",
		load: () => import("@shikijs/themes/github-dark"),
	},
	{
		id: "github-light",
		label: "GitHub Light",
		load: () => import("@shikijs/themes/github-light"),
	},
	{
		id: "light-plus",
		label: "Light+",
		load: () => import("@shikijs/themes/light-plus"),
	},
	{
		id: "monokai",
		label: "Monokai",
		load: () => import("@shikijs/themes/monokai"),
	},
	{ id: "nord", label: "Nord", load: () => import("@shikijs/themes/nord") },
	{
		id: "one-dark-pro",
		label: "One Dark Pro",
		load: () => import("@shikijs/themes/one-dark-pro"),
	},
	{
		id: "solarized-dark",
		label: "Solarized Dark",
		load: () => import("@shikijs/themes/solarized-dark"),
	},
	{
		id: "solarized-light",
		label: "Solarized Light",
		load: () => import("@shikijs/themes/solarized-light"),
	},
	{
		id: "tokyo-night",
		label: "Tokyo Night",
		load: () => import("@shikijs/themes/tokyo-night"),
	},
];
