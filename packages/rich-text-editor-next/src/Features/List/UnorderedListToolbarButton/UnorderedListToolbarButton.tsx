import { List, ReadOnly } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const UnorderedListToolbarButton = () => {
	const editor = useEditorContext();
	const list = List(editor.list);
	const readOnly = ReadOnly(editor.readOnly);

	if (!list) {
		throw new Error("List can't be undefined.");
	}

	const disabled = createMemo(() => !list.canWrap() || !!readOnly?.checked());

	const onClick = () => {
		list.wrap({ localName: "ul" });
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="ListBullets" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
