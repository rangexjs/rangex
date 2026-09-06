import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const BoldToolbarButton = () => {
	const { formatting, readOnly } = useEditorContext();

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const pressed = createMemo(() => formatting.bold().pressed);

	const checked = createMemo(
		() => pressed() === "true" || pressed() === "mixed",
	);

	const disabled = createMemo(
		() => formatting.bold().disabled || !!readOnly?.checked(),
	);

	const onClick = () => {
		formatting.toggleBold();
	};

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={pressed()}
			>
				<Icon name="Bold" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
