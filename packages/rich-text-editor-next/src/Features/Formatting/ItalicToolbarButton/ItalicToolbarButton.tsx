import { Italic, ReadOnly } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const ItalicToolbarButton = () => {
	const editor = useEditorContext();
	const italic = Italic(editor.formatting);
	const readOnly = ReadOnly(editor.readOnly);

	if (!italic) {
		throw new Error("Formatting can't be undefined.");
	}

	const disabled = createMemo(() => italic.disabled() || !!readOnly?.checked());

	const onClick = () => {
		italic.toggle();
	};

	return (
		<span>
			<ToolbarButton
				checked={italic.checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={italic.pressed()}
			>
				<Icon name="Italic" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
