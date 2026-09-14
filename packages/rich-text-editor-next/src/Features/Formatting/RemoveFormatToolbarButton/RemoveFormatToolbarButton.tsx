import { ReadOnly, RemoveFormat } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const RemoveFormatToolbarButton = () => {
	const { formatting, readOnly } = useEditorContext();

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
				<Icon name="TSlash" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
