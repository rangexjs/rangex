import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const EmptyMediaToolbarButton = () => {
	const { emptyMedia, readOnly } = useEditorContext();

	if (!emptyMedia) {
		throw new Error("EmptyMedia can't be undefined.");
	}

	const disabled = createMemo(
		() => !emptyMedia.canInsert() || !!readOnly?.checked(),
	);

	const onClick = () => {
		emptyMedia.insert();
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="FileArrowUp" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
