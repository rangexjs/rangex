import { ReadOnly, UndoRedo } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const HistoryForwardToolbarButton = () => {
	const editor = useEditorContext();
	const { undoRedo, readOnly } = editor;

	if (!undoRedo) {
		throw new Error("UndoRedo can't be undefined.");
	}

	const $undoRedo = UndoRedo(undoRedo);
	const $readOnly = ReadOnly(readOnly);

	const disabled = createMemo(
		() => !$undoRedo.canStepForward() || !!$readOnly?.checked(),
	);

	return (
		<span>
			<ToolbarButton
				disabled={disabled()}
				onClick={() => undoRedo.stepForward()}
			>
				<Icon name="ArrowBendUpRight" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
