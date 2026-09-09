import { createMemo } from "solid-js";
import { useReactiveEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const SubscriptToolbarButton = () => {
	const { formatting, readOnly } = useReactiveEditorContext();

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const disabled = createMemo(
		() => formatting.subscript().disabled || !!readOnly?.checked(),
	);

	const onClick = () => {
		formatting.toggleSubscript();
	};

	return (
		<span>
			<ToolbarButton
				checked={formatting.subscript().checked}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={formatting.subscript().pressed}
			>
				<Icon name="Subscript" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
