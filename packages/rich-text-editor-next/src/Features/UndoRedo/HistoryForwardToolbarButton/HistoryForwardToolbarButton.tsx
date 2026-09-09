import { createMemo } from "solid-js";
import { useReactiveEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const HistoryForwardToolbarButton = () => {
	const { undoRedo, readOnly } = useReactiveEditorContext();

	if (!undoRedo) {
		throw new Error("UndoRedo can't be undefined.");
	}

	const disabled = createMemo(
		() => !undoRedo.canStepForward() || !!readOnly?.checked(),
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
