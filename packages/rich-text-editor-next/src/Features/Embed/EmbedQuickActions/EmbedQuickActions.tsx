import type { CaptionPosition } from "@rangex/editor";
import { Portal } from "@solidjs/web";
import {
	createEffect,
	createSignal,
	createUniqueId,
	onCleanup,
} from "solid-js";
import { useEditorContext, useReactiveEditorContext } from "#context";
import {
	createTextFieldState,
	Icon,
	InputTextField,
	SegmentedControl,
	type SegmentedControlControls,
	TextFieldWrapper,
	ToggleButton,
} from "#ui";
import {
	type AspectRatioValue,
	aspectRatioAttrName,
	BlockAlign,
	getAspectRatio,
	OptionDropdown,
	type OptionDropdownOption,
	setAspectRatio,
} from "../../_Utilities";

const aspectRatioOptions: OptionDropdownOption<AspectRatioValue>[] = [
	{ label: "Auto", value: "auto" },
	{ label: "1:1", value: "1-1" },
	{ label: "4:3", value: "4-3" },
	{ label: "16:9", value: "16-9" },
];

const captionPositionControls: SegmentedControlControls<CaptionPosition> = [
	{ id: "above", node: "Above" },
	{ id: "below", node: "Below" },
];

export const EmbedQuickActions = () => {
	const { embed, readOnly } = useReactiveEditorContext();
	const editor = useEditorContext();

	if (!(embed && editor.embed)) {
		throw new Error("Embed can't be undefined.");
	}

	const caption = () => embed.caption();

	const embedElement = () => {
		const currentBlock = embed.currentBlock();

		return currentBlock?.querySelector<HTMLIFrameElement>("iframe") ?? null;
	};

	const [aspectRatio, setAspectRatioSignal] =
		createSignal<AspectRatioValue>("auto");

	const [titleHandle, titleControls] = createTextFieldState<HTMLInputElement>({
		defaultValue: "",
	});

	const [committedTitle, setCommittedTitle] = createSignal("");

	const isTitleDirty = () => titleHandle.value() !== committedTitle();

	const syncFromEmbed = (embedEl: HTMLIFrameElement) => {
		const aspectRatioValue = getAspectRatio(embedEl) ?? "auto";

		setAspectRatioSignal(aspectRatioValue);

		titleHandle.setValue(embedEl.title);
		setCommittedTitle(embedEl.title);
	};

	createEffect(
		() => embedElement(),
		(embedEl) => {
			if (!embedEl) {
				return;
			}

			syncFromEmbed(embedEl);

			const observer = new MutationObserver(() => {
				syncFromEmbed(embedEl);
			});

			observer.observe(embedEl, {
				attributes: true,
				attributeFilter: [aspectRatioAttrName, "title"],
			});

			return () => {
				observer.disconnect();
			};
		},
	);

	const onAspectRatioSelect = (value: AspectRatioValue) => {
		const embedEl = embedElement();

		if (!embedEl) {
			return;
		}

		setAspectRatio(embedEl, value);
		embed.commitSnapshot();
	};

	const onTitleCommit = () => {
		const embedEl = embedElement();

		if (!embedEl) {
			return;
		}

		embedEl.title = titleHandle.value();
		embed.commitSnapshot();
	};

	const onTitleKeyDown = (event: KeyboardEvent) => {
		if (event.key !== "Enter") {
			return;
		}

		onTitleCommit();
	};

	const onSwapClick = () => {
		embed.swap();
	};

	const onCaptionToggle = () => {
		if (readOnly?.checked()) {
			return;
		}

		embed.changeCaptionEnabled(!caption().enabled);
	};

	let blockAlignPopover: HTMLDivElement | undefined;
	let optionsPopover: HTMLDivElement | undefined;

	const optionsPopoverId = createUniqueId();

	const closeNestedPopovers = () => {
		const nestedPopovers = [blockAlignPopover, optionsPopover];

		for (const nestedPopover of nestedPopovers) {
			if (!nestedPopover) {
				throw new Error("Nested popover shouldn't be undefined.");
			}

			if (nestedPopover.matches(":popover-open")) {
				// Force a synchronous reflow before hiding — otherwise the popover can
				// briefly animate from a stale, not-yet-committed style.
				nestedPopover.offsetHeight;
				nestedPopover.hidePopover();
			}
		}
	};

	// We can't rely on embed.quickActionsOpen() as we have to detect the change before repaint
	const unsubscribeIsOpen = editor.embed.onQuickActionsOpenUpdate((open) => {
		if (!open) {
			closeNestedPopovers();
		}
	});

	onCleanup(() => {
		unsubscribeIsOpen();
	});

	return (
		<Portal mount={embed.quickActionsEl}>
			<div class="z-20 flex items-center gap-1 rounded-md border border-neutral-200 bg-white p-0.5 shadow-xs dark:border-neutral-700 dark:bg-neutral-900">
				<BlockAlign
					value={embed.align()}
					disabled={readOnly?.checked()}
					onChange={(value) => embed.changeAlign(value)}
					popoverRef={(el) => {
						blockAlignPopover = el;
					}}
				/>

				<button
					type="button"
					class="btn-menu-trigger flex items-center justify-center rounded p-1"
					title="Swap"
					disabled={!embed.canSwap || readOnly?.checked()}
					onClick={onSwapClick}
				>
					<Icon name="Swap" class="size-4" />
				</button>

				<span>
					<button
						type="button"
						commandfor={optionsPopoverId}
						command="toggle-popover"
						class="btn-menu-trigger flex items-center justify-center rounded p-1"
						title="Options"
						disabled={readOnly?.checked()}
					>
						<Icon name="DotsThreeHorizontal" class="size-4" />
					</button>

					<div
						ref={(el) => {
							optionsPopover = el;
						}}
						id={optionsPopoverId}
						popover="auto"
						class="w-44 space-y-2 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm [position-area:center_bottom] dark:border-neutral-700 dark:bg-neutral-900"
					>
						<OptionDropdown
							label="Aspect ratio"
							value={aspectRatio()}
							options={aspectRatioOptions}
							onSelect={onAspectRatioSelect}
						/>

						<div class="flex items-center justify-between">
							<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">
								Caption
							</span>
							<ToggleButton
								checked={caption().enabled}
								onClick={onCaptionToggle}
							/>
						</div>

						<div hidden={!caption().enabled}>
							<SegmentedControl
								id={caption().position}
								controls={captionPositionControls}
								onChange={(value) => embed.changeCaptionPosition(value)}
								appearance="primary-outline"
								class="rounded-sm"
								commonButtonClass="rounded-sm py-1 font-medium text-xs"
							/>
						</div>

						<div class="flex flex-col gap-1">
							<div class="flex items-center justify-between">
								<label
									for={titleHandle.id}
									class="font-medium text-neutral-600 text-xs dark:text-neutral-300"
								>
									Title
								</label>
								<span
									class="text-neutral-500 text-xs dark:text-neutral-400"
									hidden={!isTitleDirty()}
								>
									Enter to save
								</span>
							</div>
							<TextFieldWrapper
								appearance="neutral-filled-underline"
								size="small"
							>
								<InputTextField
									type="text"
									placeholder="Describe this embed for screen readers"
									spellcheck={false}
									{...titleControls}
									onBlur={onTitleCommit}
									onKeyDown={onTitleKeyDown}
								/>
							</TextFieldWrapper>
						</div>
					</div>
				</span>
			</div>
		</Portal>
	);
};
