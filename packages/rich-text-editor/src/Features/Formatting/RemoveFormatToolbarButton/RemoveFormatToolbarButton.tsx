import { ReadOnly, RemoveFormat } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const RemoveFormatToolbarButton = () => {
	const editor = useEditorContext();
	const { formatting, readOnly } = editor;

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const $removeFormat = RemoveFormat(formatting);
	const $readOnly = ReadOnly(readOnly);

	const disabled = createMemo(
		() => $removeFormat.disabled() || !!$readOnly?.checked(),
	);

	const onClick = () => {
		formatting.removeLineFormat();
		formatting.removeTextFormat();
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="TSlash" title="Clear formatting" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
