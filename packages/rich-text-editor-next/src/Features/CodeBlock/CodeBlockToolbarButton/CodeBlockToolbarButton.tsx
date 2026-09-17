import { CodeBlock, ReadOnly } from "@rangex/solid";
import { createMemo, createUniqueId } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import {
	ToolbarButton,
	ToolbarDropdown,
	type ToolbarDropdownList,
} from "../../_Utilities";

export const CodeBlockToolbarButton = () => {
	const { codeBlock, readOnly } = useEditorContext();

	if (!codeBlock) {
		throw new Error("CodeBlock can't be undefined.");
	}

	const $codeBlock = CodeBlock(codeBlock);
	const $readOnly = ReadOnly(readOnly);

	const disabled = createMemo(
		() =>
			!$codeBlock.canWrap() ||
			!!$readOnly?.checked() ||
			!codeBlock.languages.length,
	);

	const popoverId = createUniqueId();

	const list = createMemo<ToolbarDropdownList>(() =>
		codeBlock.languages.map(({ id, label }) => ({
			text: label,
			button: {
				onClick: () => {
					codeBlock.wrap({ language: id, theme: codeBlock.defaultTheme });
				},
			},
		})),
	);

	return (
		<span>
			<ToolbarButton
				disabled={disabled()}
				commandfor={popoverId}
				command="toggle-popover"
				hasChevron={true}
			>
				<Icon name="CodeBlock" class="size-4" />
			</ToolbarButton>

			<ToolbarDropdown
				id={popoverId}
				list={list()}
				class="[position-area:bottom_center]"
			/>
		</span>
	);
};
