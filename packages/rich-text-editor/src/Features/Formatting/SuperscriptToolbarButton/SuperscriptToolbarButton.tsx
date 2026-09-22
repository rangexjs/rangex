import { ReadOnly, Superscript } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const SuperscriptToolbarButton = () => {
	const editor = useEditorContext();
	const { formatting, readOnly } = editor;

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const $superscript = Superscript(formatting);
	const $readOnly = ReadOnly(readOnly);

	const disabled = createMemo(
		() => $superscript.disabled() || !!$readOnly?.checked(),
	);

	const onClick = () => {
		formatting.toggleSuperscript();
	};

	return (
		<span>
			<ToolbarButton
				checked={$superscript.checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={$superscript.pressed()}
			>
				<Icon name="Superscript" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
