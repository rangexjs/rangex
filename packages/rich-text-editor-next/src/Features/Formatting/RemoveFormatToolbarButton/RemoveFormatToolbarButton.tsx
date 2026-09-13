import { ReadOnly, RemoveFormat } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const RemoveFormatToolbarButton = () => {
	const editor = useEditorContext();
	const removeFormat = RemoveFormat(editor.formatting);
	const readOnly = ReadOnly(editor.readOnly);

	if (!removeFormat) {
		throw new Error("Formatting can't be undefined.");
	}

	const disabled = createMemo(
		() => removeFormat.disabled() || !!readOnly?.checked(),
	);

	const onClick = () => {
		removeFormat.remove();
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="TSlash" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
