import { initRichTextEditor } from "../InitRichTextEditor";

export const createDevelopmentView = () => {
	const container = document.createElement("div");

	Object.assign<CSSStyleDeclaration, Partial<CSSStyleDeclaration>>(
		container.style,
		{
			display: "block flex",
			flexDirection: "column",
			gap: "30px",
			margin: "60px auto",
			maxWidth: "1200px",
		},
	);

	const richTextEditor = initRichTextEditor();

	container.append(richTextEditor.editorHost);

	return container;
};
