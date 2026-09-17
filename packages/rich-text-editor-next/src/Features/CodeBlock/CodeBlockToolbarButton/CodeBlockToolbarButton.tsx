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
		() => !$codeBlock.canWrap() || !!$readOnly?.checked(),
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

	const hasLanguages = createMemo(() => list().length > 0);

	const wrap = () => {
		if (hasLanguages()) {
			return;
		}

		codeBlock.wrap({ language: null, theme: null });
	};

	return (
		<span>
			<ToolbarButton
				disabled={disabled()}
				commandfor={hasLanguages() ? popoverId : undefined}
				command={hasLanguages() ? "toggle-popover" : undefined}
				hasChevron={hasLanguages()}
				onClick={wrap}
			>
				<Icon name="CodeBlock" class="size-4" />
			</ToolbarButton>

			<ToolbarDropdown
				id={popoverId}
				list={list()}
				class={["[position-area:bottom_center]", { hidden: !hasLanguages() }]}
			/>
		</span>
	);
};
