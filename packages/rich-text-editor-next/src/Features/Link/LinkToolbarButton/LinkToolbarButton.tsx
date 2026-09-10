import { createMemo } from "solid-js";
import { useReactiveEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const LinkToolbarButton = () => {
	const { link, readOnly } = useReactiveEditorContext();

	if (!link) {
		throw new Error("Link can't be undefined.");
	}

	const disabled = createMemo(() => !link.canApply() || !!readOnly?.checked());

	const onClick = () => {
		link.toolbarClick();
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="SimpleLink" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
