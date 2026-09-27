import { EmptyMedia, ReadOnly } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const EmptyMediaToolbarButton = () => {
	const editor = useEditorContext();
	const { emptyMedia, readOnly } = editor;

	if (!emptyMedia) {
		throw new Error("EmptyMedia can't be undefined.");
	}

	const $emptyMedia = EmptyMedia(emptyMedia);
	const $readOnly = ReadOnly(readOnly);

	const disabled = createMemo(
		() => !$emptyMedia.canInsert() || !!$readOnly?.checked(),
	);

	const onClick = () => {
		emptyMedia.insert();
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="FileArrowUp" title="Insert media" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
