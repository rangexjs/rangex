import { createMemo, createSignal } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { ToolbarButton } from "../_Utilities";

export const SuperscriptToolbarButton = () => {
	const { formatStylesButtonsStateManager, toolbarButtonsActionManager } =
		useToolbarButtonManagersContext();

	const { superscript } = formatStylesButtonsStateManager;

	const [disabled, setDisabled] = createSignal(superscript.disabled);
	const [pressed, setPressed] = createSignal(superscript.pressed);

	const checked = createMemo(
		() => pressed() === "true" || pressed() === "mixed",
	);

	formatStylesButtonsStateManager.subscribe({
		type: toolbarButtonsName.superscript,
		callback: (state) => {
			setDisabled(state.disabled);
			setPressed(state.pressed);
		},
	});

	const onClick = () => {
		toolbarButtonsActionManager.emitFormatStylesChange({
			superscript: pressed(),
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
				<Icon name="Superscript" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
