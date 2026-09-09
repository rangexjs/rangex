import { createMemo } from "solid-js";
import { useReactiveEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const StrikethroughToolbarButton = () => {
	const { formatting, readOnly } = useReactiveEditorContext();

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const disabled = createMemo(
		() => formatting.strikethrough().disabled || !!readOnly?.checked(),
	);

	const onClick = () => {
		formatting.toggleStrikethrough();
	};

	return (
		<span>
			<ToolbarButton
				checked={formatting.strikethrough().checked}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={formatting.strikethrough().pressed}
			>
				<Icon name="Strikethrough" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
