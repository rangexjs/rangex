import type { CreateEditorParams } from "@rangex/editor";
import { createEditor as createCoreEditor } from "@rangex/editor";
import { AccordionItem } from "../ReactivePorts/AccordionItem";
import { CodeBlock } from "../ReactivePorts/CodeBlock";
import { EmptyMedia } from "../ReactivePorts/EmptyMedia";
import { Formatting } from "../ReactivePorts/Formatting";
import type { CreateEditorResult, SolidEditor } from "./RangeXEditor-types";

export const createEditor = (
	params: CreateEditorParams,
): CreateEditorResult => {
	const { editor, host, floatingContainer } = createCoreEditor(params);

	const disposeList = new Set<() => void>();

	const solidEditor: SolidEditor = {
		destroy() {
			for (const dispose of disposeList) {
				dispose();
			}

			editor.destroy();
		},
	};

	if (editor.accordionItem) {
		const { port, dispose } = AccordionItem(editor.accordionItem);

		solidEditor.accordionItem = port;
		disposeList.add(dispose);
	}

	if (editor.codeBlock) {
		const { port, dispose } = CodeBlock(editor.codeBlock);

		solidEditor.codeBlock = port;
		disposeList.add(dispose);
	}

	if (editor.emptyMedia) {
		const { port, dispose } = EmptyMedia(editor.emptyMedia);

		solidEditor.emptyMedia = port;
		disposeList.add(dispose);
	}

	if (editor.formatting) {
		const { port, dispose } = Formatting(editor.formatting);

		solidEditor.formatting = port;
		disposeList.add(dispose);
	}

	return { editor: solidEditor, host, floatingContainer };
};
