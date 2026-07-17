import { createMemo, createSignal, createUniqueId } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import type { LineLocalNameValue } from "../../../ToolbarButtonProps";
import { useToolbarButtonManagersContext } from "../../App";
import { Dropdown, type DropdownList, ToolbarButton } from "../_Utilities";

export const LineLocalNameToolbarButton = () => {
	const { formatStylesButtonsStateManager, toolbarButtonsActionManager } =
		useToolbarButtonManagersContext();

	const { lineLocalName } = formatStylesButtonsStateManager;

	const [checked, setChecked] = createSignal(false);
	const [disabled, setDisabled] = createSignal(lineLocalName.disabled);
	const [lineLocalNames, setLineLocalNames] = createSignal(
		lineLocalName.values,
	);

	formatStylesButtonsStateManager.subscribe({
		type: toolbarButtonsName.lineLocalName,
		callback: (state) => {
			setDisabled(state.disabled);
			setLineLocalNames(state.values);
		},
	});

	const getTitle = (localName: LineLocalNameValue) => {
		const title = {
			p: "Paragraph",
			h1: "Heading 1",
			h2: "Heading 2",
			h3: "Heading 3",
			h4: "Heading 4",
			h5: "Heading 5",
			h6: "Heading 6",
		}[localName];

		return title;
	};

	const title = createMemo(() => {
		const localNames = lineLocalNames();

		if (localNames.size === 0) {
			return "None";
		}

		if (localNames.size > 1) {
			return "Mixed";
		}

		const [localName] = [...localNames];

		return getTitle(localName);
	});

	const popoverId = createUniqueId();

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const list = createMemo<DropdownList>(() => {
		const updateLocalName = (lineLocalName: LineLocalNameValue) => {
			toolbarButtonsActionManager.emitFormatStylesChange({ lineLocalName });
		};

		const localNames: LineLocalNameValue[] = [
			"p",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
		];

		const dropDownList: DropdownList = localNames.map<DropdownList[number]>(
			(localName) => {
				return {
					text: getTitle(localName),
					checked: lineLocalNames().has(localName),
					button: {
						"on:click": () => {
							updateLocalName(localName);
						},
						class: "justify-center",
					},
				};
			},
		);

		return dropDownList;
	});

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				hasChevron={true}
				commandfor={popoverId}
				command="toggle-popover"
				containerClass="text-sm font-semibold min-w-22.5"
			>
				{title()}
			</ToolbarButton>
			<Dropdown
				id={popoverId}
				list={list()}
				onToggle={onPopoverToggle}
				class="w-[anchor-size(width)] [position-area:span-right_bottom]"
			/>
		</span>
	);
};
