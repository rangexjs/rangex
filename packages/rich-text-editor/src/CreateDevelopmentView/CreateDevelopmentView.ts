import {
	createBeamText,
	createContentLine,
	createRootEditable,
	defineRangeX,
} from "rich-text-area";
import storedSnapshot from "../mock_database/Demo.json";
import { RichTextEditor } from "../RichTextEditor";

import "../Styles/FontStyles.css";

import { getDefaultContentLineLocalNamesStyles } from "../_Utilities";

// window.$snapshot = (node) => {
// 	const res = createToEditorNodeSnapshot({ editorNode: node });

// 	console.log(JSON.stringify(res));
// };

const { RangeX } = defineRangeX({});

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

	const emptyRootEditable = createRootEditable({
		display: "block multi-line",
		contentLineLocalNamesStyle: getDefaultContentLineLocalNamesStyles(),
		childNodes: [
			createContentLine({ localName: "p", childNodes: [createBeamText()] }),
		],
	});

	const emptyRichTextArea = new RangeX({
		rootEditableFrom: {
			type: "node",
			node: emptyRootEditable,
		},
		shadowRootOptions: {
			mode: "open",
			serializable: true,
			slotAssignment: "manual",
		},
	});

	const emptyRichTextEditor = new RichTextEditor({
		rangeX: emptyRichTextArea,
	});

	const filledRichTextArea = new RangeX({
		rootEditableFrom: {
			type: "snapshot",
			// @ts-expect-error
			storedSnapshot,
		},
		shadowRootOptions: {
			mode: "open",
			serializable: true,
			slotAssignment: "manual",
		},
	});

	const filledRichTextEditor = new RichTextEditor({
		rangeX: filledRichTextArea,
	});

	maxViewContainer.append(emptyRichTextEditor, filledRichTextEditor);

	return maxViewContainer;
};
