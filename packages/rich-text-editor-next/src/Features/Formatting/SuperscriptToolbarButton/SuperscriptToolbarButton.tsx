import { ReadOnly, Superscript } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const SuperscriptToolbarButton = () => {
	const editor = useEditorContext();
	const superscript = Superscript(editor.formatting);
	const readOnly = ReadOnly(editor.readOnly);

	if (!superscript) {
		throw new Error("Formatting can't be undefined.");
	}

	const disabled = createMemo(
		() => superscript.disabled() || !!readOnly?.checked(),
	);

	const onClick = () => {
		superscript.toggle();
	};

	return (
		<span>
			<ToolbarButton
				checked={superscript.checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={superscript.pressed()}
			>
				<Icon name="Superscript" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
