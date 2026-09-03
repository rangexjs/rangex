import type { CreateEditorParams } from "@rangex/editor";
import { createEditor as createCoreEditor } from "@rangex/editor";
import { CodeBlock } from "../ReactivePorts/CodeBlock";
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

	if (editor.codeBlock) {
		const { port, dispose } = CodeBlock(editor.codeBlock);

		solidEditor.codeBlock = port;
		disposeList.add(dispose);
	}

	return { editor: solidEditor, host, floatingContainer };
};
