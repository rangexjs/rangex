import { createMemo } from "solid-js";
import { useReactiveEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const LinkToolbarButton = () => {
	const { link, readOnly } = useReactiveEditorContext();

	if (!link) {
		throw new Error("Link can't be undefined.");
	}

	const disabled = createMemo(() => !link.canInsert() || !!readOnly?.checked());

	const onClick = () => {
		if (link.selectionMenuOpen()) {
			link.closeSelectionMenu();
		} else {
			link.openSelectionMenu();
		}
	};

	return (
		<span>
			<ToolbarButton
				checked={link.selectionMenuOpen()}
				disabled={disabled()}
				onClick={onClick}
			>
				<Icon name="SimpleLink" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
