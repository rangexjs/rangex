import { List, ReadOnly } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const OrderedListToolbarButton = () => {
	const { list, readOnly } = useEditorContext();

	if (!list) {
		throw new Error("List can't be undefined.");
	}

	const $list = List(list);
	const $readOnly = ReadOnly(readOnly);

	const disabled = createMemo(() => !$list.canWrap() || !!$readOnly?.checked());

	const onClick = () => {
		list.wrap({ localName: "ol" });
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="ListNumbers" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
