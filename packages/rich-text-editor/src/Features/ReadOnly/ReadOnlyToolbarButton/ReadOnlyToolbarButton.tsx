import { ReadOnly } from "@rangex/solid";

import { useEditorContext } from "#context";
import { Icon } from "#ui";

import { ToolbarButton } from "../../_Utilities";

export const ReadOnlyToolbarButton = () => {
	const editor = useEditorContext();
	const { readOnly } = editor;

	if (!readOnly) {
		throw new Error("ReadOnly can't be undefined.");
	}

	const $readOnly = ReadOnly(readOnly);

	const onClick = () => {
		readOnly.toggle();
	};

	return (
		<span>
			<ToolbarButton
				checked={$readOnly.checked()}
				onClick={onClick}
				aria-pressed={`${$readOnly.checked()}`}
			>
				<Icon name="LockSimple" title="Read only" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
