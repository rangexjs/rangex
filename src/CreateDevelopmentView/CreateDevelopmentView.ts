import {
	Audio,
	CodeBlock,
	Embed,
	EmptyMedia,
	Formatting,
	Image,
	Link,
	Mention,
	RichTextEditor,
	Video,
} from "@rangex/rich-text-editor";
import storedSnapshot from "../MockDatabase/Demo.json";

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

	const emptyRichTextEditor = new RichTextEditor({
		extensions: [
			Link(),
			Mention(),
			Formatting(),
			EmptyMedia(),
			Image(),
			Video(),
			Audio(),
			Embed(),
			CodeBlock(),
		],
	});

	const filledRichTextEditor = new RichTextEditor({
		// @ts-expect-error
		storedSnapshot,
		extensions: [
			Link(),
			Mention(),
			Formatting(),
			EmptyMedia(),
			Image(),
			Video(),
			Audio(),
			Embed(),
			CodeBlock(),
		],
	});

	maxViewContainer.append(emptyRichTextEditor, filledRichTextEditor);

	return maxViewContainer;
};
