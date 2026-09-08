import type { CreateEditorParams } from "@rangex/editor";
import { createEditor as createCoreEditor } from "@rangex/editor";
import type { CreateEditorResult, SolidEditor } from "./RangeXEditor-types";
import { wireReactivePorts } from "./WireReactivePorts";

export const createEditor = (
	params: CreateEditorParams,
): CreateEditorResult => {
	const { editor, host, floatingContainer, hostStyles } =
		createCoreEditor(params);

	const disposeList = new Set<() => void>();

	const solidEditor: SolidEditor = {
		destroy() {
			for (const dispose of disposeList) {
				dispose();
			}

			editor.destroy();
		},
	};

	wireReactivePorts({ editor, solidEditor, disposeList });

	return { editor: solidEditor, host, floatingContainer, hostStyles };
};
