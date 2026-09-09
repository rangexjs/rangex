import { createMemo } from "solid-js";
import { useReactiveEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const SuperscriptToolbarButton = () => {
	const { formatting, readOnly } = useReactiveEditorContext();

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const disabled = createMemo(
		() => formatting.superscript().disabled || !!readOnly?.checked(),
	);

	const onClick = () => {
		formatting.toggleSuperscript();
	};

	return (
		<span>
			<ToolbarButton
				checked={formatting.superscript().checked}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={formatting.superscript().pressed}
			>
				<Icon name="Superscript" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
