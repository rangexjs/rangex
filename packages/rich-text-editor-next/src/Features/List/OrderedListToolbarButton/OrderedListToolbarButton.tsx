import { createMemo } from "solid-js";
import { useReactiveEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const OrderedListToolbarButton = () => {
	const { list, readOnly } = useReactiveEditorContext();

	if (!list) {
		throw new Error("List can't be undefined.");
	}

	const disabled = createMemo(() => !list.canWrap() || !!readOnly?.checked());

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
