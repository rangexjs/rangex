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

	const isOrderedListActive = createMemo(() => {
		const currentComponent = $list.currentComponent();

		if (!($list.isSelectionActive() && currentComponent)) {
			return false;
		}

		// The first list element is the component's own list; nested lists come after it.
		const listElement = currentComponent.querySelector("ol, ul");

		return listElement?.localName === "ol";
	});

	const disabled = createMemo(
		() =>
			!($list.isSelectionActive() || $list.canWrap()) || !!$readOnly?.checked(),
	);

	const onClick = () => {
		if ($list.isSelectionActive()) {
			list.unwrap();
			return;
		}

		list.wrap({ localName: "ol" });
	};

	return (
		<span>
			<ToolbarButton
				checked={isOrderedListActive()}
				disabled={disabled()}
				onClick={onClick}
			>
				<Icon name="ListNumbers" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
