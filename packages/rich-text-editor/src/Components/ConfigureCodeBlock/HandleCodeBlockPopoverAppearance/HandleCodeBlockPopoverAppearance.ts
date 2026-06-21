import {
	type BlockNestedContext,
	blockNestedContextName,
	type EditorElement,
	isEditorNode,
} from "rich-text-area";
import { componentsName } from "../../../Constants";
import { toUILanguage } from "../_Utilities";
import { ensureNodeCodeBlockStorage } from "../CodeBlockStorage";
import type { HandleCodeBlockPopoverAppearanceParams } from "./HandleCodeBlockPopoverAppearance-types";

const isCodeBlock = (element: EditorElement) =>
	element.$$editorRole === blockNestedContextName &&
	element.$$componentName === componentsName.codeBlock;

/**
 * Shows/hides the code block popover on pointer hover. A short delay before hiding
 * prevents the popover from dismissing when the pointer moves between the code block
 * and the popover itself.
 */
export const handleCodeBlockPopoverAppearance = ({
	richTextEditorUI,
	editorAPI,
	internals,
}: HandleCodeBlockPopoverAppearanceParams) => {
	const { codeBlockPopover } = richTextEditorUI;
	const { popover } = codeBlockPopover;

	let hideTimeoutId = NaN;

	const scheduleHide = () => {
		clearTimeout(hideTimeoutId);
		hideTimeoutId = setTimeout(() => {
			popover.hidePopover();
		}, 100);
	};

	const cancelHide = () => {
		clearTimeout(hideTimeoutId);
	};

	const onToggle = (event: ToggleEvent) => {
		if (event.newState === "closed") {
			internals.currentCodeBlock = null;
		}
	};

	popover.addEventListener("pointerenter", cancelHide);
	popover.addEventListener("pointerleave", scheduleHide);
	popover.addEventListener("toggle", onToggle);

	const showPopover = (codeBlock: BlockNestedContext) => {
		cancelHide();
		const { lang, theme } = ensureNodeCodeBlockStorage({
			blockNestedContext: codeBlock,
		});
		codeBlockPopover.updateState({
			language: toUILanguage(lang),
			lightTheme: theme.light,
			darkTheme: theme.dark,
		});
		popover.style.cssText = "";
		popover.style.inset = "auto";
		popover.style.margin = "4px";
		popover.style.positionArea = "top right";
		popover.style.top = "100%";
		popover.style.right = "100%";

		if (internals.currentCodeBlock === codeBlock) {
			return;
		}

		internals.currentCodeBlock = codeBlock;

		popover.hidePopover();
		popover.showPopover({ source: codeBlock });
	};

	editorAPI.registerDOMEvent({
		when: ({ element }) => isCodeBlock(element),
		eventListener: {
			type: "pointerenter",
			listener(event) {
				const { currentTarget } = event;

				if (!(currentTarget && isEditorNode(currentTarget))) {
					throw new Error("CurrentTarget must be an EditorNode.");
				}

				if (currentTarget.$$editorRole !== blockNestedContextName) {
					throw new Error("CurrentTarget's type is invalid.");
				}

				showPopover(currentTarget);
			},
		},
	});

	editorAPI.registerDOMEvent({
		when: ({ element }) => isCodeBlock(element),
		eventListener: {
			type: "pointerleave",
			listener: scheduleHide,
		},
	});
};
