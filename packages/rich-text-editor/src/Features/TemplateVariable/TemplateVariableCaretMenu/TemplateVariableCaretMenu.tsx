import { TemplateVariable } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext, useUIOptionsContext } from "#context";
import {
	type CaretItemFn,
	CaretMenu,
	filterCaretMenuItems,
} from "../../_Utilities";

export const TemplateVariableCaretMenu = () => {
	const editor = useEditorContext();
	const uiOptions = useUIOptionsContext();
	const { templateVariable } = editor;
	const options = uiOptions.templateVariable;

	if (!templateVariable) {
		throw new Error("TemplateVariable can't be undefined.");
	}

	if (!options) {
		throw new Error("TemplateVariable UI options can't be undefined.");
	}

	const $templateVariable = TemplateVariable(templateVariable);

	const getLabel = (fieldName: string) => {
		const dropdownItem = options.dropdown.find(
			(item) => item.fieldName === fieldName,
		);

		return dropdownItem?.label ?? fieldName;
	};

	const filteredItems = createMemo(() =>
		filterCaretMenuItems({
			items: templateVariable.items,
			query: $templateVariable.caretMenu.query(),
			getKeys: (item) => [getLabel(item.fieldName)],
		}),
	);

	const items = () =>
		filteredItems().map((item): CaretItemFn => {
			return ({ isActive }) => (
				<button
					type="button"
					class={[
						"flex w-full items-center rounded-sm px-2 py-1.5 text-left font-mono text-sm active:bg-neutral-200 active:dark:bg-neutral-700",
						{ "bg-neutral-100 dark:bg-neutral-800": isActive() },
					]}
					onClick={() => templateVariable.select(item)}
				>
					{getLabel(item.fieldName)}
				</button>
			);
		});

	const onSelect = (index: number) => {
		const item = filteredItems().at(index);

		if (!item) {
			return;
		}

		templateVariable.select(item);
	};

	return (
		<CaretMenu
			caretMenuPort={templateVariable.caretMenu}
			items={items}
			onSelect={onSelect}
			class="min-w-40 max-w-56"
		/>
	);
};
