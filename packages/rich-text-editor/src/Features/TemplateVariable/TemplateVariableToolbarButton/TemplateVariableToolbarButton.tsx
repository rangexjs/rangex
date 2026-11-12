import { ReadOnly, TemplateVariable } from "@rangex/solid";
import { createMemo, createSignal, createUniqueId, For } from "solid-js";

import {
	type TemplateVariableModalSettings,
	useEditorContext,
	useUIOptionsContext,
} from "#context";
import { Icon } from "#ui";

import { ToolbarButton, ToolbarDropdown, type ToolbarDropdownList } from "../../_Utilities";
import { TemplateVariableModal } from "./TemplateVariableModal";

export const TemplateVariableToolbarButton = () => {
	const editor = useEditorContext();
	const uiOptions = useUIOptionsContext();
	const { templateVariable, readOnly } = editor;
	const options = uiOptions.templateVariable;

	if (!templateVariable) {
		throw new Error("TemplateVariable can't be undefined.");
	}

	if (!options) {
		throw new Error("TemplateVariable UI options can't be undefined.");
	}

	const $templateVariable = TemplateVariable(templateVariable);
	const $readOnly = ReadOnly(readOnly);

	const [checked, setChecked] = createSignal(false);

	const disabled = createMemo(() => !$templateVariable.canInsert() || !!$readOnly?.checked());

	const popoverId = createUniqueId();

	const modalIds = new Map<TemplateVariableModalSettings, string>();

	for (const { settings } of options.dropdown) {
		if (!modalIds.has(settings)) {
			modalIds.set(settings, createUniqueId());
		}
	}

	const list: ToolbarDropdownList = options.dropdown.map((item) => ({
		text: item.label,
		button: {
			onClick: () => {
				templateVariable.insert({ fieldName: item.fieldName });
			},
		},
		settings: {
			commandfor: modalIds.get(item.settings),
			command: "show-modal",
		},
	}));

	const onPopoverToggle = (event: ToggleEvent) => {
		setChecked(event.newState === "open");
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
				<Icon name="TemplateVariable" title="Template variable" class="size-4" />
			</ToolbarButton>

			<ToolbarDropdown
				id={popoverId}
				list={list}
				class="[position-area:bottom_center]"
				onToggle={onPopoverToggle}
			/>

			<For each={[...modalIds]}>
				{([settings, modalId]) => (
					<TemplateVariableModal
						modalId={modalId}
						templateVariable={templateVariable}
						settings={settings}
					/>
				)}
			</For>
		</span>
	);
};
