import { List, ReadOnly } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const UnorderedListToolbarButton = () => {
	const editor = useEditorContext();
	const { list, readOnly } = editor;

	if (!list) {
		throw new Error("List can't be undefined.");
	}

	const $list = List(list);
	const $readOnly = ReadOnly(readOnly);

	const disabled = createMemo(
		() =>
			!($list.isSelectionActive() || $list.canWrap()) || !!$readOnly?.checked(),
	);

	const onClick = () => {
		const localName = $list.localName();

		if (localName === "ul") {
			list.unwrap();
			return;
		}

		if (localName) {
			list.changeLocalName("ul");
			return;
		}

		list.wrap({ localName: "ul" });
	};

	return (
		<span>
			<ToolbarButton
				checked={$list.localName() === "ul"}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={`${$list.localName() === "ul"}`}
			>
				<Icon name="ListBullets" title="Bulleted list" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
