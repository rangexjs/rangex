import { ReadOnly, SourcePlaceholder } from "@rangex/solid";
import { createMemo } from "solid-js";

import { useEditorContext } from "#context";
import { Icon } from "#ui";

import { ToolbarButton } from "../../_Utilities";

export const SourcePlaceholderToolbarButton = () => {
	const editor = useEditorContext();
	const { sourcePlaceholder, readOnly } = editor;

	if (!sourcePlaceholder) {
		throw new Error("SourcePlaceholder can't be undefined.");
	}

	const $sourcePlaceholder = SourcePlaceholder(sourcePlaceholder);
	const $readOnly = ReadOnly(readOnly);

	const disabled = createMemo(() => !$sourcePlaceholder.canInsert() || !!$readOnly?.checked());

	const onClick = () => {
		sourcePlaceholder.insert();
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="FileArrowUp" title="Insert media" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
