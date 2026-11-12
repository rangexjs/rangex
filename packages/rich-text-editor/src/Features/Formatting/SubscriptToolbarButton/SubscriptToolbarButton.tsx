import { ReadOnly, Subscript } from "@rangex/solid";
import { createMemo } from "solid-js";

import { useEditorContext } from "#context";
import { Icon } from "#ui";

import { ToolbarButton } from "../../_Utilities";

export const SubscriptToolbarButton = () => {
	const editor = useEditorContext();
	const { formatting, readOnly } = editor;

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const $subscript = Subscript(formatting);
	const $readOnly = ReadOnly(readOnly);

	const disabled = createMemo(() => $subscript.disabled() || !!$readOnly?.checked());

	const onClick = () => {
		formatting.toggleSubscript();
	};

	return (
		<span>
			<ToolbarButton
				checked={$subscript.checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={$subscript.pressed()}
			>
				<Icon name="Subscript" title="Subscript" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
