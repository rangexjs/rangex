import { Code, ReadOnly } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const CodeToolbarButton = () => {
	const editor = useEditorContext();
	const { formatting, readOnly } = editor;

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const $code = Code(formatting);
	const $readOnly = ReadOnly(readOnly);

	const disabled = createMemo(() => $code.disabled() || !!$readOnly?.checked());

	const onClick = () => {
		formatting.toggleCode();
	};

	return (
		<span>
			<ToolbarButton
				checked={$code.checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={$code.pressed()}
			>
				<Icon name="Code" title="Inline code" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
