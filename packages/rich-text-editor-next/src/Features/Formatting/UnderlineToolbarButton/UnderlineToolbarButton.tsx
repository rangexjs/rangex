import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const UnderlineToolbarButton = () => {
	const { formatting, readOnly } = useEditorContext();

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const disabled = createMemo(
		() => formatting.underline().disabled || !!readOnly?.checked(),
	);

	const onClick = () => {
		formatting.toggleUnderline();
	};

	return (
		<span>
			<ToolbarButton
				checked={formatting.underline().checked}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={formatting.underline().pressed}
			>
				<Icon name="Underline" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
