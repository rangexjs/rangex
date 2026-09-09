import type { FormattingLineLocalNameValue } from "@rangex/editor";
import { createMemo, createSignal, createUniqueId } from "solid-js";
import { useReactiveEditorContext } from "#context";
import {
	ToolbarButton,
	ToolbarDropdown,
	type ToolbarDropdownList,
} from "../../_Utilities";

export const LineLocalNameToolbarButton = () => {
	const { formatting, readOnly } = useReactiveEditorContext();

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const [checked, setChecked] = createSignal(false);

	const titles: Record<FormattingLineLocalNameValue, string> = {
		p: "Paragraph",
		h1: "Heading 1",
		h2: "Heading 2",
		h3: "Heading 3",
		h4: "Heading 4",
		h5: "Heading 5",
		h6: "Heading 6",
	};

	const getTitle = (localName: FormattingLineLocalNameValue) =>
		titles[localName];

	const title = createMemo(() => {
		const localNames = formatting.lineLocalName().values;

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

	const list = createMemo<ToolbarDropdownList>(() => {
		const activeValues = formatting.lineLocalName().values;

		const localNames: FormattingLineLocalNameValue[] = [
			"p",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
		];

		return localNames.map<ToolbarDropdownList[number]>((localName) => {
			return {
				text: getTitle(localName),
				checked: activeValues.has(localName),
				button: {
					onClick: () => {
						formatting.setLineLocalName(localName);
					},
					class: "justify-center",
				},
			};
		});
	});

	const disabled = createMemo(
		() => formatting.lineLocalName().disabled || !!readOnly?.checked(),
	);

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
			<ToolbarDropdown
				id={popoverId}
				list={list()}
				onToggle={onPopoverToggle}
				class="w-[anchor-size(width)] [position-area:span-right_bottom]"
			/>
		</span>
	);
};
