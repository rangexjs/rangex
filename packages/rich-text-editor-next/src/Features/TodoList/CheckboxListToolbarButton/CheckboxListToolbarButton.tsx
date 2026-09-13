import { ReadOnly, TodoList } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const CheckboxListToolbarButton = () => {
	const editor = useEditorContext();
	const todoList = TodoList(editor.todoList);
	const readOnly = ReadOnly(editor.readOnly);

	if (!todoList) {
		throw new Error("TodoList can't be undefined.");
	}

	const disabled = createMemo(
		() => !todoList.canWrap() || !!readOnly?.checked(),
	);

	const onClick = () => {
		todoList.wrap();
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="ListChecks" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
