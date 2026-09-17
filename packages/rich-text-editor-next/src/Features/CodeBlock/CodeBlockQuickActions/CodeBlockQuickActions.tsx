import { CodeBlock, FloatingPortal, ReadOnly } from "@rangex/solid";
import { createSignal, Show } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { CodeBlockHighlight } from "./CodeBlockHighlight";

export const CodeBlockQuickActions = () => {
	const { codeBlock, readOnly } = useEditorContext();

	if (!codeBlock) {
		throw new Error("CodeBlock can't be undefined.");
	}

	const $codeBlock = CodeBlock(codeBlock);
	const $readOnly = ReadOnly(readOnly);

	const [copied, setCopied] = createSignal(false);

	const onCopyClick = (() => {
		let timeoutId = NaN;
		return () => {
			const plainText = codeBlock.getPlainText();
			const lines = plainText.join("\n");
			navigator.clipboard.writeText(lines);
			setCopied(true);
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => setCopied(false), 1200);
		};
	})();

	return (
		<FloatingPortal mount={codeBlock.quickActions.element}>
			<div class="z-20 flex items-center gap-1 rounded-md border border-neutral-200 bg-white p-0.5 shadow-xs dark:border-neutral-700 dark:bg-neutral-900">
				<button
					type="button"
					class="btn-menu-trigger flex items-center justify-center rounded p-1"
					title="Copy"
					disabled={$readOnly?.checked()}
					onClick={onCopyClick}
				>
					<Icon name={copied() ? "Check" : "CopySimple"} class="size-4" />
				</button>

				<Show when={codeBlock.canHighlight}>
					<CodeBlockHighlight
						codeBlock={codeBlock}
						$codeBlock={$codeBlock}
						readOnly={$readOnly}
					/>
				</Show>
			</div>
		</FloatingPortal>
	);
};
