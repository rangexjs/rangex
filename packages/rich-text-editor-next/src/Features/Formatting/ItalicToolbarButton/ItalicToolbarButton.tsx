import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const ItalicToolbarButton = () => {
	const { formatting, readOnly } = useEditorContext();

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const disabled = createMemo(
		() => formatting.italic().disabled || !!readOnly?.checked(),
	);

	const onClick = () => {
		formatting.toggleItalic();
	};

	return (
		<span>
			<ToolbarButton
				checked={formatting.italic().checked}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={formatting.italic().pressed}
			>
				<Icon name="Italic" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
