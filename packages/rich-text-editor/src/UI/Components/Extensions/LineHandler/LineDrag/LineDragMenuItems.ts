import type { LineHandlerUIPort } from "#adapters";
import type { MenuItem } from "../_Utilities";

export interface CreateLineDragMenuItemsParams {
	uiPort: LineHandlerUIPort;
}

export function createLineDragMenuItems({
	uiPort,
}: CreateLineDragMenuItemsParams): MenuItem[] {
	return [
		{
			type: "submenu",
			label: "Turn Into",
			icon: "Swap",
			items: [
				{
					type: "button",
					label: "Paragraph",
					icon: "Paragraph",
					checked: () => undefined,
					onClick: () => undefined,
				},
				{
					type: "button",
					label: "Heading 1",
					icon: "TextHOne",
					checked: () => undefined,
					onClick: () => undefined,
				},
				{
					type: "button",
					label: "Heading 2",
					icon: "TextHTwo",
					checked: () => undefined,
					onClick: () => undefined,
				},
				{
					type: "button",
					label: "Heading 3",
					icon: "TextHThree",
					checked: () => undefined,
					onClick: () => undefined,
				},
				{
					type: "button",
					label: "Heading 4",
					icon: "TextHFour",
					checked: () => undefined,
					onClick: () => undefined,
				},
				{
					type: "button",
					label: "Heading 5",
					icon: "TextHFive",
					checked: () => undefined,
					onClick: () => undefined,
				},
				{
					type: "button",
					label: "Heading 6",
					icon: "TextHSix",
					checked: () => undefined,
					onClick: () => undefined,
				},
				{
					type: "button",
					label: "Blockquote",
					icon: "BlockQuote",
					checked: () => undefined,
					onClick: () => undefined,
				},
				{
					type: "button",
					label: "Codeblock",
					icon: "CodeBlock",
					checked: () => undefined,
					onClick: () => undefined,
				},
			],
		},
		{
			type: "button",
			label: "Delete",
			icon: "Trash",
			checked: () => undefined,
			onClick: () => uiPort.emitDelete(),
		},
		{
			type: "button",
			label: "Duplicate",
			icon: "CopySimple",
			checked: () => undefined,
			onClick: () => uiPort.emitDuplicate(),
		},
	];
}
