import { createMemo } from "solid-js";
import { useReactiveEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const BoldToolbarButton = () => {
	const { formatting, readOnly } = useReactiveEditorContext();

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const disabled = createMemo(
		() => formatting.bold().disabled || !!readOnly?.checked(),
	);

	const onClick = () => {
		formatting.toggleBold();
	};

	return (
		<span>
			<ToolbarButton
				checked={formatting.bold().checked}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={formatting.bold().pressed}
			>
				<Icon name="Bold" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
