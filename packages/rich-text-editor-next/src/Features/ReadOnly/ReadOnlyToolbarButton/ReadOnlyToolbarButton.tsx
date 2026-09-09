import { useReactiveEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const ReadOnlyToolbarButton = () => {
	const { readOnly } = useReactiveEditorContext();

	if (!readOnly) {
		throw new Error("ReadOnly can't be undefined.");
	}

	const onClick = () => {
		readOnly.toggle();
	};

	return (
		<span>
			<ToolbarButton
				checked={readOnly.checked()}
				onClick={onClick}
				aria-pressed={`${readOnly.checked()}`}
			>
				<Icon name="LockSimple" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
