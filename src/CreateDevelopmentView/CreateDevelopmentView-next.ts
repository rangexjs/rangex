import {
	AccordionItem,
	Audio,
	BlockQuote,
	CodeBlock,
	CommandMenu,
	createRichTextEditor,
	Embed,
	Emoji,
	EmptyMedia,
	type Extension,
	FindReplace,
	Formatting,
	Image,
	List,
	Markdown,
	Mention,
	ReadOnly,
	Separator,
	Shortcuts,
	Symbols,
	TemplateVariable,
	TodoList,
	UndoRedo,
	Video,
} from "@rangex/rich-text-editor-next";
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

	const extensions: Extension[] = [
		AccordionItem({}),
		Audio({}),
		BlockQuote({}),
		Embed({}),
		Emoji({}),
		EmptyMedia({ uploadFile }),
		FindReplace({}),
		Formatting({}),
		CodeBlock({}),
		CommandMenu({}),
		Image({}),
		List({}),
		Markdown({}),
		Mention({}),
		ReadOnly({}),
		Separator({}),
		Shortcuts({}),
		Symbols({}),
		TemplateVariable({}),
		TodoList({}),
		UndoRedo({}),
		Video({}),
	];

	const filledRichTextEditor = createRichTextEditor({
		// biome-ignore lint/suspicious/noExplicitAny: Fix later
		storedSnapshot: storedSnapshot as any,
		extensions,
	});

	maxViewContainer.append(filledRichTextEditor.editorHost);

	return maxViewContainer;
};
