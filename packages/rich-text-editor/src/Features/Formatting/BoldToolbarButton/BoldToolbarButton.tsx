import { Bold, ReadOnly } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const BoldToolbarButton = () => {
	const editor = useEditorContext();
	const { formatting, readOnly } = editor;

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const $bold = Bold(formatting);
	const $readOnly = ReadOnly(readOnly);

	const disabled = createMemo(() => $bold.disabled() || !!$readOnly?.checked());

	const onClick = () => {
		formatting.toggleBold();
	};

	return (
		<span>
			<ToolbarButton
				checked={$bold.checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={$bold.pressed()}
			>
				<Icon name="Bold" title="Bold" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
