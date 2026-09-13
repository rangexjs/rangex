import { ReadOnly, Underline } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const UnderlineToolbarButton = () => {
	const editor = useEditorContext();
	const underline = Underline(editor.formatting);
	const readOnly = ReadOnly(editor.readOnly);

	if (!underline) {
		throw new Error("Formatting can't be undefined.");
	}

	const disabled = createMemo(
		() => underline.disabled() || !!readOnly?.checked(),
	);

	const onClick = () => {
		underline.toggle();
	};

	return (
		<span>
			<ToolbarButton
				checked={underline.checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={underline.pressed()}
			>
				<Icon name="Underline" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
