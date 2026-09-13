import { Code, ReadOnly } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const CodeToolbarButton = () => {
	const editor = useEditorContext();
	const code = Code(editor.formatting);
	const readOnly = ReadOnly(editor.readOnly);

	if (!code) {
		throw new Error("Formatting can't be undefined.");
	}

	const disabled = createMemo(() => code.disabled() || !!readOnly?.checked());

	const onClick = () => {
		code.toggle();
	};

	return (
		<span>
			<ToolbarButton
				checked={code.checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={code.pressed()}
			>
				<Icon name="Code" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
