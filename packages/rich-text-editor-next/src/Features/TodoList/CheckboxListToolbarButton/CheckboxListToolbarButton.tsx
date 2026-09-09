import { createMemo } from "solid-js";
import { useReactiveEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const CheckboxListToolbarButton = () => {
	const { todoList, readOnly } = useReactiveEditorContext();

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
