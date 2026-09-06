import type { FormattingTextAlignValue } from "@rangex/editor";
import { createMemo, createSignal, createUniqueId, For } from "solid-js";
import { useEditorContext } from "#context";
import { Icon, type IconName } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const textAlignValues: FormattingTextAlignValue[] = [
	"start",
	"center",
	"end",
	"justify",
];

const iconNameOptions: Record<FormattingTextAlignValue, IconName> = {
	start: "TextAlignLeft",
	center: "TextAlignCenter",
	end: "TextAlignRight",
	justify: "TextAlignJustify",
};

const getToolbarIconFromActiveValues = (
	activeValues: Set<FormattingTextAlignValue>,
): IconName => {
	if (activeValues.size === 0) {
		return iconNameOptions.start;
	}

	const { value } = activeValues.values().next();

	if (!value) {
		throw new Error("Value can't be undefined.");
	}

	return iconNameOptions[value];
};

export const TextAlignToolbarButton = () => {
	const { formatting, readOnly } = useEditorContext();

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const [checked, setChecked] = createSignal(false);

	const toolbarIcon = createMemo(() =>
		getToolbarIconFromActiveValues(formatting.textAlign().values),
	);

	const popoverId = createUniqueId();

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const onTextAlignClick = (textAlign: FormattingTextAlignValue) => {
		formatting.setTextAlign(textAlign);
	};

	const disabled = createMemo(
		() => formatting.textAlign().disabled || !!readOnly?.checked(),
	);

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				hasChevron={true}
				commandfor={popoverId}
				command="toggle-popover"
			>
				<Icon name={toolbarIcon()} class="size-4" />
			</ToolbarButton>

			<div
				id={popoverId}
				popover="auto"
				class="mt-1 rounded-md border border-neutral-200 bg-white p-1 shadow-md [position-area:center_bottom] dark:border-neutral-700 dark:bg-neutral-900"
				onToggle={onPopoverToggle}
			>
				<div class="flex gap-0.5">
					<For each={textAlignValues}>
						{(name) => (
							<ToolbarButton
								checked={formatting.textAlign().values.has(name)}
								commandfor={popoverId}
								command="hide-popover"
								onClick={() => onTextAlignClick(name)}
							>
								<Icon name={iconNameOptions[name]} class="size-4" />
							</ToolbarButton>
						)}
					</For>
				</div>
			</div>
		</span>
	);
};
