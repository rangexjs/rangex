import { createMemo } from "solid-js";
import { useReactiveEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const RemoveFormatToolbarButton = () => {
	const { formatting, readOnly } = useReactiveEditorContext();

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const disabled = createMemo(
		() =>
			(formatting.removeLine().disabled && formatting.removeText().disabled) ||
			!!readOnly?.checked(),
	);

	const onClick = () => {
		formatting.removeLineFormat();
		formatting.removeTextFormat();
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="TSlash" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
