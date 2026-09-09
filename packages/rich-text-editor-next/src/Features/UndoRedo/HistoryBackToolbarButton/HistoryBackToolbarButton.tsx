import { createMemo } from "solid-js";
import { useReactiveEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const HistoryBackToolbarButton = () => {
	const { undoRedo, readOnly } = useReactiveEditorContext();

	if (!undoRedo) {
		throw new Error("UndoRedo can't be undefined.");
	}

	const disabled = createMemo(
		() => !undoRedo.canStepBack() || !!readOnly?.checked(),
	);

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={() => undoRedo.stepBack()}>
				<Icon name="ArrowBendUpLeft" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
