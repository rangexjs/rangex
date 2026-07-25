import {
	CodeBlockAdapter,
	type CodeBlockLanguage,
	type CodeBlockTheme,
} from "#adapters";
import { configureCodeBlock } from "#editor-extensions";
import { extensionsName, toolbarButtonsName } from "#ports";
import { CodeBlockToolbarButton } from "#ui-extensions";
import { createExtension } from "../_Utilities";

const defaultLanguages: CodeBlockLanguage[] = [
	"TypeScript",
	"JavaScript",
	"React",
	"CSS",
	"Python",
	"Java",
	"C",
	"C++",
	"C#",
	"Rust",
	"Go",
	"Kotlin",
	"PHP",
	"Ruby",
	"Swift",
	"Dart",
	"SQL",
	"Bash",
	"Markdown",
	"HTML",
	"JSON",
];

const defaultThemes: CodeBlockTheme[] = [
	"Catppuccin Mocha",
	"Dark+",
	"Dracula",
	"GitHub Dark",
	"GitHub Light",
	"Light+",
	"Monokai",
	"Nord",
	"One Dark Pro",
	"Solarized Dark",
	"Solarized Light",
	"Tokyo Night",
];

export const CodeBlock = createExtension({
	name: extensionsName.codeBlock,
	defaultSettings: {
		languages: defaultLanguages,
		themes: defaultThemes,
	},
	createAdapter: (settings, options) => new CodeBlockAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureCodeBlock({ editorPort: adapter.editorPort, editorAPI }),
	components: {
		toolbarButtons: {
			[toolbarButtonsName.codeBlock]: CodeBlockToolbarButton,
		},
	},
});
