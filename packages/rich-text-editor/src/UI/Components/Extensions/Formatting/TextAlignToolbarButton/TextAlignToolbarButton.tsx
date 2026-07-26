import {
	createMemo,
	createSignal,
	createUniqueId,
	For,
	onCleanup,
	onMount,
} from "solid-js";
import type { FormattingTextAlignValue } from "#adapters";
import { useUIPortsContext } from "../../../App";
import { Icon, type IconName } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

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
	const { formattingUIPort: uiPort } = useUIPortsContext();

	if (!uiPort) {
		throw new Error("FormattingUIPort can't be null.");
	}

	const [checked, setChecked] = createSignal(false);
	const [disabled, setDisabled] = createSignal(uiPort.textAlign.disabled);
	const [activeValues, setActiveValues] = createSignal(uiPort.textAlign.values);

	onMount(() => {
		const unsubscribe = uiPort.onTextAlignUpdate((state) => {
			setDisabled(state.disabled);
			setActiveValues(state.values);
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const toolbarIcon = createMemo(() =>
		getToolbarIconFromActiveValues(activeValues()),
	);

	const popoverId = createUniqueId();

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const onTextAlignClick = (textAlign: FormattingTextAlignValue) => {
		uiPort.emitFormattingChange({ textAlign });
	};

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
				on:toggle={onPopoverToggle}
			>
				<div class="flex gap-0.5">
					<For each={textAlignValues}>
						{(name) => (
							<ToolbarButton
								checked={activeValues().has(name)}
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
