import { Bold, ReadOnly } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const BoldToolbarButton = () => {
	const editor = useEditorContext();
	const bold = Bold(editor.formatting);
	const readOnly = ReadOnly(editor.readOnly);

	if (!bold) {
		throw new Error("Formatting can't be undefined.");
	}

	const disabled = createMemo(() => bold.disabled() || !!readOnly?.checked());

	const onClick = () => {
		bold.toggle();
	};

	return (
		<span>
			<ToolbarButton
				checked={bold.checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={bold.pressed()}
			>
				<Icon name="Bold" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
