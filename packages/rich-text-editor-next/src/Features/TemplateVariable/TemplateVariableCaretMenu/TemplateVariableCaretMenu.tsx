import { TemplateVariable } from "@rangex/solid";
import { useEditorContext } from "#context";
import { type CaretItemFn, CaretMenu } from "#ui";

export const TemplateVariableCaretMenu = () => {
	const editor = useEditorContext();
	const templateVariable = TemplateVariable(editor.templateVariable);

	if (!templateVariable) {
		throw new Error("TemplateVariable can't be undefined.");
	}

	const items = () =>
		templateVariable.filteredItems().map((item): CaretItemFn => {
			return ({ isActive }) => (
				<button
					type="button"
					class={[
						"flex w-full items-center rounded-sm px-2 py-1.5 text-left font-mono text-sm active:bg-neutral-200 active:dark:bg-neutral-700",
						{ "bg-neutral-100 dark:bg-neutral-800": isActive() },
					]}
					onClick={() => templateVariable.select(item)}
				>
					{item.label}
				</button>
			);
		});

	const onSelect = (index: number) => {
		const item = templateVariable.filteredItems().at(index);

		if (!item) {
			return;
		}

		templateVariable.select(item);
	};

	return (
		<CaretMenu
			caretMenuEl={templateVariable.caretMenu.element}
			items={items}
			isOpen={templateVariable.caretMenu.isOpen}
			onSelect={onSelect}
			class="min-w-40 max-w-56"
		/>
	);
};
