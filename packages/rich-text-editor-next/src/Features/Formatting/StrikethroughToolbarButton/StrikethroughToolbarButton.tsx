import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const StrikethroughToolbarButton = () => {
	const { formatting, readOnly } = useEditorContext();

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const pressed = createMemo(() => formatting.strikethrough().pressed);

	const checked = createMemo(
		() => pressed() === "true" || pressed() === "mixed",
	);

	const disabled = createMemo(
		() => formatting.strikethrough().disabled || !!readOnly?.checked(),
	);

	const onClick = () => {
		formatting.toggleStrikethrough();
	};

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={pressed()}
			>
				<Icon name="Strikethrough" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
