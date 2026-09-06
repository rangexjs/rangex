import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const SuperscriptToolbarButton = () => {
	const { formatting, readOnly } = useEditorContext();

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const pressed = createMemo(() => formatting.superscript().pressed);

	const checked = createMemo(
		() => pressed() === "true" || pressed() === "mixed",
	);

	const disabled = createMemo(
		() => formatting.superscript().disabled || !!readOnly?.checked(),
	);

	const onClick = () => {
		formatting.toggleSuperscript();
	};

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={pressed()}
			>
				<Icon name="Superscript" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
