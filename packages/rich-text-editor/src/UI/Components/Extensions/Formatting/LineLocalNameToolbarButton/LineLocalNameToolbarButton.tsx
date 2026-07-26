import {
	createMemo,
	createSignal,
	createUniqueId,
	onCleanup,
	onMount,
} from "solid-js";
import type { FormattingLineLocalNameValue } from "#adapters";
import { useUIPortsContext } from "../../../App";
import {
	Dropdown,
	type DropdownList,
	ToolbarButton,
} from "../../../ToolbarButtons/_Utilities";

export const LineLocalNameToolbarButton = () => {
	const { formattingUIPort, readOnlyUIPort } = useUIPortsContext();

	if (!formattingUIPort) {
		throw new Error("FormattingUIPort can't be null.");
	}

	const [checked, setChecked] = createSignal(false);
	const [buttonDisabled, setButtonDisabled] = createSignal(
		formattingUIPort.lineLocalName.disabled,
	);
	const [lineLocalNames, setLineLocalNames] = createSignal(
		formattingUIPort.lineLocalName.values,
	);
	const [readOnly, setReadOnly] = createSignal(
		!!readOnlyUIPort?.toolbarButton.checked,
	);

	onMount(() => {
		const unsubscribeLineLocalName = formattingUIPort.onLineLocalNameUpdate(
			(state) => {
				setButtonDisabled(state.disabled);
				setLineLocalNames(state.values);
			},
		);
		const unsubscribeReadOnly = readOnlyUIPort?.onToolbarButtonUpdate((state) =>
			setReadOnly(state.checked),
		);

		onCleanup(() => {
			unsubscribeLineLocalName();
			unsubscribeReadOnly?.();
		});
	});

	const getTitle = (localName: FormattingLineLocalNameValue) => {
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
		const updateLocalName = (lineLocalName: FormattingLineLocalNameValue) => {
			formattingUIPort.emitFormattingChange({ lineLocalName });
		};

		const localNames: FormattingLineLocalNameValue[] = [
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

	const disabled = createMemo(() => buttonDisabled() || readOnly());

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
