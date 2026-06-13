import { createMemo, createSignal } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { ToolbarButton } from "../_Utilities";

export const BoldToolbarButton = () => {
	const { formatStylesButtonsStateManager, toolbarButtonsActionManager } =
		useToolbarButtonManagersContext();

	const { bold } = formatStylesButtonsStateManager;

	const [disabled, setDisabled] = createSignal(bold.disabled);
	const [pressed, setPressed] = createSignal(bold.pressed);

	const checked = createMemo(
		() => pressed() === "true" || pressed() === "mixed",
	);

	formatStylesButtonsStateManager.subscribe({
		type: toolbarButtonsName.bold,
		callback: (state) => {
			setDisabled(state.disabled);
			setPressed(state.pressed);
		},
	});

	const onClick = () => {
		toolbarButtonsActionManager.emitFormatStylesChange({ bold: pressed() });
	};

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={pressed()}
			>
				<Icon name="Bold" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
