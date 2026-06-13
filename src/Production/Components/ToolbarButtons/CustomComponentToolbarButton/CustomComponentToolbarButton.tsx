import { createSignal, createUniqueId } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import type { CustomComponentName } from "../../../ToolbarButtonProps";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { Dropdown, type DropdownList, ToolbarButton } from "../_Utilities";

export const customComponentNames: CustomComponentName[] = [
	"Carousel",
	"Collapsible",
	"Page Break",
];

export const CustomComponentToolbarButton = () => {
	const { toolbarButtonsActionManager, nodeInsertionButtonsStateManager } =
		useToolbarButtonManagersContext();

	const { customComponent } = nodeInsertionButtonsStateManager;

	const [checked, setChecked] = createSignal(false);
	const [disabled, setDisabled] = createSignal(customComponent.disabled);

	nodeInsertionButtonsStateManager.subscribe({
		type: toolbarButtonsName.customComponent,
		callback: (state) => setDisabled(state.disabled),
	});

	const popoverId = createUniqueId();

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const list: DropdownList = customComponentNames.map((name) => {
		return {
			text: name,
			button: {
				"on:click": () => {
					toolbarButtonsActionManager.emitNodeInsertionChange({
						type: toolbarButtonsName.customComponent,
						name,
					});
				},
			},
		};
	});

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				commandfor={popoverId}
				command="toggle-popover"
				hasChevron={true}
			>
				<Icon name="SquaresFour" class="size-4" />
			</ToolbarButton>

			<Dropdown
				id={popoverId}
				list={list}
				class="[position-area:bottom_center]"
				onToggle={onPopoverToggle}
			/>
		</span>
	);
};
