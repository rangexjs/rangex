import { ReadOnly, Strikethrough } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const StrikethroughToolbarButton = () => {
	const { formatting, readOnly } = useEditorContext();

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const $strikethrough = Strikethrough(formatting);
	const $readOnly = ReadOnly(readOnly);

	const disabled = createMemo(
		() => $strikethrough.disabled() || !!$readOnly?.checked(),
	);

	const onClick = () => {
		formatting.toggleStrikethrough();
	};

	return (
		<span>
			<ToolbarButton
				checked={$strikethrough.checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={$strikethrough.pressed()}
			>
				<Icon name="Strikethrough" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
