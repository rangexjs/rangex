import { TemplateVariable } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { type CaretItemFn, CaretMenu } from "#ui";

export const TemplateVariableCaretMenu = () => {
	const editor = useEditorContext();
	const { templateVariable } = editor;

	if (!templateVariable) {
		throw new Error("TemplateVariable can't be undefined.");
	}

	const $templateVariable = TemplateVariable(templateVariable);

	const filteredItems = createMemo(() => {
		const query = $templateVariable.query();

		if (query === null) {
			return [];
		}

		const q = query.toLowerCase();

		return $templateVariable.items.filter((item) =>
			item.label.toLowerCase().includes(q),
		);
	});

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
					{item.label}
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
