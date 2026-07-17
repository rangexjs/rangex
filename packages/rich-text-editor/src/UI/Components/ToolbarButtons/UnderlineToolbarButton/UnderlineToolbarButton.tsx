import { createMemo, createSignal } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { ToolbarButton } from "../_Utilities";

export const UnderlineToolbarButton = () => {
	const { formatStylesButtonsStateManager, toolbarButtonsActionManager } =
		useToolbarButtonManagersContext();

	const { underline } = formatStylesButtonsStateManager;

	const [disabled, setDisabled] = createSignal(underline.disabled);
	const [pressed, setPressed] = createSignal(underline.pressed);

	const checked = createMemo(
		() => pressed() === "true" || pressed() === "mixed",
	);

	formatStylesButtonsStateManager.subscribe({
		type: toolbarButtonsName.underline,
		callback: (state) => {
			setDisabled(state.disabled);
			setPressed(state.pressed);
		},
	});

	const onClick = () => {
		toolbarButtonsActionManager.emitFormatStylesChange({
			underline: pressed(),
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
				<Icon name="Underline" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
