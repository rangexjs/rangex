import {
	AccordionItem,
	Audio,
	BlockQuote,
	CodeBlock,
	CommandMenu,
	Embed,
	Emoji,
	EmptyMedia,
	type ExtensionValue,
	FindReplace,
	Formatting,
	Image,
	LineHandler,
	Link,
	List,
	Markdown,
	Mention,
	ReadOnly,
	RichTextEditor,
	Separator,
	Shortcuts,
	Symbols,
	Table,
	TemplateVariable,
	TodoList,
	UndoRedo,
	Video,
} from "@rangex/rich-text-editor";
import storedSnapshot from "../MockDatabase/Demo-features.json";

/**
 * Demo-only stand-in for a real upload — inlines the file as a base64 data URL instead of
 * sending it anywhere. A consumer building a real editor should replace this with a function
 * that uploads to their own storage and resolves the resulting URL.
 */
const uploadFile = ({
	file,
	onProgress,
}: {
	file: File;
	onProgress?: (progress: number) => void;
}): Promise<string | null> => {
	return new Promise((resolve) => {
		const reader = new FileReader();

		reader.onprogress = (event) => {
			if (event.lengthComputable) {
				onProgress?.(event.loaded / event.total);
			}
		};

		reader.onload = () => {
			resolve(reader.result as string);
		};

		reader.onerror = () => {
			resolve(null);
		};

		reader.readAsDataURL(file);
	});
};

// window.$snapshot = (node) => {
// 	const res = createToEditorNodeSnapshot({ editorNode: node });

// 	console.log(JSON.stringify(res));
// };

export const createDevelopmentView = () => {
	const maxViewContainer = document.createElement("div");

	Object.assign<CSSStyleDeclaration, Partial<CSSStyleDeclaration>>(
		maxViewContainer.style,
		{
			display: "block flex",
			flexDirection: "column",
			gap: "30px",
			margin: "0 auto",
			maxWidth: "1200px",
		},
	);

	const extensions: ExtensionValue[] = [
		Link({}),
		Mention({}),
		Formatting({}),
		EmptyMedia({ uploadFile }),
		Image({ uploadFile }),
		Video({ uploadFile }),
		Audio({ uploadFile }),
		Embed({}),
		CodeBlock({}),
		BlockQuote({}),
		List({}),
		TodoList({}),
		Emoji({}),
		TemplateVariable({}),
		Table({}),
		UndoRedo({}),
		Symbols({}),
		FindReplace({}),
		AccordionItem({}),
		Separator({}),
		ReadOnly({}),
		CommandMenu({}),
		LineHandler({}),
		Markdown({}),
		Shortcuts({}),
	];

	const emptyRichTextEditor = new RichTextEditor({
		extensions,
	});

	const filledRichTextEditor = new RichTextEditor({
		// @ts-expect-error
		storedSnapshot,
		extensions,
	});

	maxViewContainer.append(emptyRichTextEditor, filledRichTextEditor);

	return maxViewContainer;
};
