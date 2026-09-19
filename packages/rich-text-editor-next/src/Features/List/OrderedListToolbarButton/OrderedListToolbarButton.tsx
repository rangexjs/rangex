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
		() => !($list.isActive() || $list.canWrap()) || !!$readOnly?.checked(),
	);

	const onClick = () => {
		if ($list.isActive()) {
			list.unwrap();
			return;
		}

		list.wrap({ localName: "ol" });
	};

	return (
		<span>
			<ToolbarButton
				checked={$list.isActive()}
				disabled={disabled()}
				onClick={onClick}
			>
				<Icon name="ListNumbers" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
