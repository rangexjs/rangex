import { ReadOnly, Subscript } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const SubscriptToolbarButton = () => {
	const editor = useEditorContext();
	const subscript = Subscript(editor.formatting);
	const readOnly = ReadOnly(editor.readOnly);

	if (!subscript) {
		throw new Error("Formatting can't be undefined.");
	}

	const disabled = createMemo(
		() => subscript.disabled() || !!readOnly?.checked(),
	);

	const onClick = () => {
		subscript.toggle();
	};

	return (
		<span>
			<ToolbarButton
				checked={subscript.checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={subscript.pressed()}
			>
				<Icon name="Subscript" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
