import { createMemo } from "solid-js";
import { useReactiveEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const CodeToolbarButton = () => {
	const { formatting, readOnly } = useReactiveEditorContext();

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const disabled = createMemo(
		() => formatting.code().disabled || !!readOnly?.checked(),
	);

	const onClick = () => {
		formatting.toggleCode();
	};

	return (
		<span>
			<ToolbarButton
				checked={formatting.code().checked}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={formatting.code().pressed}
			>
				<Icon name="Code" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
