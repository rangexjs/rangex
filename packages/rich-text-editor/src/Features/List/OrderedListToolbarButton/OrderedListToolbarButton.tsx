import { List, ReadOnly } from "@rangex/solid";
import { createMemo } from "solid-js";

import { useEditorContext } from "#context";
import { Icon } from "#ui";

import { ToolbarButton } from "../../_Utilities";

export const OrderedListToolbarButton = () => {
	const editor = useEditorContext();
	const { list, readOnly } = editor;

	if (!list) {
		throw new Error("List can't be undefined.");
	}

	const $list = List(list);
	const $readOnly = ReadOnly(readOnly);

	const disabled = createMemo(
		() => !($list.isSelectionActive() || $list.canWrap()) || !!$readOnly?.checked(),
	);

	const onClick = () => {
		const localName = $list.localName();

		if (localName === "ol") {
			list.unwrap();
			return;
		}

		if (localName) {
			list.changeLocalName("ol");
			return;
		}

		list.wrap({ localName: "ol" });
	};

	return (
		<span>
			<ToolbarButton
				checked={$list.localName() === "ol"}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={`${$list.localName() === "ol"}`}
			>
				<Icon name="ListNumbers" title="Numbered list" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
