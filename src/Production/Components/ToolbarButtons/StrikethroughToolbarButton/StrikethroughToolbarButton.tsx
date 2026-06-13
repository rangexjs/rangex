import { createMemo, createSignal } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { ToolbarButton } from "../_Utilities";

export const StrikethroughToolbarButton = () => {
	const { formatStylesButtonsStateManager, toolbarButtonsActionManager } =
		useToolbarButtonManagersContext();

	const { strikethrough } = formatStylesButtonsStateManager;

	const [disabled, setDisabled] = createSignal(strikethrough.disabled);
	const [pressed, setPressed] = createSignal(strikethrough.pressed);

	const checked = createMemo(
		() => pressed() === "true" || pressed() === "mixed",
	);

	formatStylesButtonsStateManager.subscribe({
		type: toolbarButtonsName.strikethrough,
		callback: (state) => {
			setDisabled(state.disabled);
			setPressed(state.pressed);
		},
	});

	const onClick = () => {
		toolbarButtonsActionManager.emitFormatStylesChange({
			strikethrough: pressed(),
		});
	};

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={pressed()}
			>
				<Icon name="Strikethrough" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
