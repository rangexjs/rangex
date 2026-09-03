import { AccordionItem } from "../../ReactivePorts/AccordionItem";
import { CodeBlock } from "../../ReactivePorts/CodeBlock";
import { EmptyMedia } from "../../ReactivePorts/EmptyMedia";
import { Formatting } from "../../ReactivePorts/Formatting";
import type { WireReactivePortsParams } from "./WireReactivePorts-types";

export const wireReactivePorts = ({
	editor,
	solidEditor,
	disposeList,
}: WireReactivePortsParams) => {
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
};
