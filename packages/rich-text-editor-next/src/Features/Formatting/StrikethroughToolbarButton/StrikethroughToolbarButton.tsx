import { ReadOnly, Strikethrough } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const StrikethroughToolbarButton = () => {
	const editor = useEditorContext();
	const strikethrough = Strikethrough(editor.formatting);
	const readOnly = ReadOnly(editor.readOnly);

	if (!strikethrough) {
		throw new Error("Formatting can't be undefined.");
	}

	const disabled = createMemo(
		() => strikethrough.disabled() || !!readOnly?.checked(),
	);

	const onClick = () => {
		strikethrough.toggle();
	};

	return (
		<span>
			<ToolbarButton
				checked={strikethrough.checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={strikethrough.pressed()}
			>
				<Icon name="Strikethrough" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
