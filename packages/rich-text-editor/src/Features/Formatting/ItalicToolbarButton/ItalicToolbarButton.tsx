import { Italic, ReadOnly } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const ItalicToolbarButton = () => {
	const editor = useEditorContext();
	const { formatting, readOnly } = editor;

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const $italic = Italic(formatting);
	const $readOnly = ReadOnly(readOnly);

	const disabled = createMemo(
		() => $italic.disabled() || !!$readOnly?.checked(),
	);

	const onClick = () => {
		formatting.toggleItalic();
	};

	return (
		<span>
			<ToolbarButton
				checked={$italic.checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={$italic.pressed()}
			>
				<Icon name="Italic" title="Italic" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
