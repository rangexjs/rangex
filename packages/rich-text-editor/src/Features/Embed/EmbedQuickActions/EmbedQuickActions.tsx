import type { CaptionPosition } from "@rangex/editor";
import type { EmbedAttrsPatch } from "@rangex/editor/embed";
import { Embed, FloatingPortal, ReadOnly } from "@rangex/solid";
import { createEffect, createSignal, createUniqueId, onCleanup } from "solid-js";

import { useEditorContext } from "#context";
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
	isAspectRatioValue,
	MediaSource,
	OptionDropdown,
	type OptionDropdownOption,
} from "../../_Utilities";

const aspectRatioOptions: OptionDropdownOption<AspectRatioValue | null>[] = [
	{ label: "Auto", value: null },
	{ label: "1:1", value: "1 / 1" },
	{ label: "4:3", value: "4 / 3" },
	{ label: "16:9", value: "16 / 9" },
];

const captionPositionControls: SegmentedControlControls<CaptionPosition> = [
	{ id: "above", node: "Above" },
	{ id: "below", node: "Below" },
];

export const EmbedQuickActions = () => {
	const editor = useEditorContext();
	const { embed, readOnly } = editor;

	if (!embed) {
		throw new Error("Embed can't be undefined.");
	}

	const $embed = Embed(embed);
	const $readOnly = ReadOnly(readOnly);

	const iframeAttrs = () => $embed.domAttrs()?.iframe ?? null;

	// An invalid aspect ratio (e.g. from an old snapshot) is shown as "Auto"
	const aspectRatio = (): AspectRatioValue | null => {
		const value = iframeAttrs()?.[aspectRatioAttrName] ?? null;

		return isAspectRatioValue(value) ? value : null;
	};

	const [titleHandle, titleControls] = createTextFieldState<HTMLInputElement>({
		defaultValue: "",
	});

	const [committedTitle, setCommittedTitle] = createSignal("");

	const isTitleDirty = () => titleHandle.value() !== committedTitle();

	createEffect(
		() => iframeAttrs()?.title ?? "",
		(title) => {
			titleHandle.setValue(title);
			setCommittedTitle(title);
		},
	);

	const changeEmbedAttrs = (iframeAttrsPatch: EmbedAttrsPatch["iframe"]) => {
		if (!embed.domAttrs) {
			return;
		}

		const changeFailed = embed.changeDOMAttrs({ iframe: iframeAttrsPatch });

		if (changeFailed) {
			console.warn("Embed's attributes were rejected.", changeFailed);
		}
	};

	const onAspectRatioSelect = (value: AspectRatioValue | null) => {
		changeEmbedAttrs({ [aspectRatioAttrName]: value });
	};

	const onTitleCommit = () => {
		if (!isTitleDirty()) {
			return;
		}

		changeEmbedAttrs({ title: titleHandle.value() });
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
		embed.changeCaptionEnabled(!$embed.captionEnabled());
	};

	let blockAlignPopover: HTMLDivElement | undefined;
	let optionsPopover: HTMLDivElement | undefined;
	let mediaSourcePopover: HTMLDivElement | undefined;

	const optionsPopoverId = createUniqueId();

	const closeNestedPopovers = () => {
		const nestedPopovers = [blockAlignPopover, mediaSourcePopover, optionsPopover];

		for (const nestedPopover of nestedPopovers) {
			if (!nestedPopover) {
				throw new Error("Nested popover shouldn't be undefined.");
			}

			if (nestedPopover.matches(":popover-open")) {
				// Force a synchronous reflow before hiding — otherwise the popover can
				// briefly animate from a stale, not-yet-committed style.
				// oxlint-disable-next-line no-unused-expressions -- Reading offsetHeight forces a synchronous reflow
				nestedPopover.offsetHeight;
				nestedPopover.hidePopover();
			}
		}
	};

	const unsubscribeIsOpen = embed.quickActions.onToggle(() => {
		if (!embed.quickActions.isOpen) {
			closeNestedPopovers();
		}
	});

	onCleanup(() => {
		unsubscribeIsOpen();
	});

	return (
		<FloatingPortal mount={embed.quickActions.element}>
			<div class="z-20 flex items-center gap-1 rounded-md border border-neutral-200 bg-white p-0.5 shadow-xs dark:border-neutral-700 dark:bg-neutral-900">
				<BlockAlign
					value={$embed.align()}
					disabled={$readOnly?.checked()}
					onChange={(value) => embed.changeAlign(value)}
					popoverRef={(el) => {
						blockAlignPopover = el;
					}}
				/>

				<button
					type="button"
					class="btn-menu-trigger flex items-center justify-center rounded p-1"
					aria-label="Swap embed"
					disabled={!embed.canSwap || $readOnly?.checked()}
					onClick={onSwapClick}
				>
					<Icon name="Swap" class="size-4" />
				</button>

				<MediaSource
					src={$embed.domAttrs()?.iframe.src ?? null}
					label="Embed source"
					popoverRef={(el) => {
						mediaSourcePopover = el;
					}}
				/>

				<span>
					<button
						type="button"
						commandfor={optionsPopoverId}
						command="toggle-popover"
						class="btn-menu-trigger flex items-center justify-center rounded p-1"
						aria-label="Embed options"
						disabled={$readOnly?.checked()}
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
							notFoundLabel="Custom"
							onSelect={onAspectRatioSelect}
						/>

						<div class="flex items-center justify-between">
							<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">
								Caption
							</span>
							<ToggleButton
								checked={$embed.captionEnabled()}
								label="Caption"
								onClick={onCaptionToggle}
							/>
						</div>

						<div hidden={!$embed.captionEnabled()}>
							<SegmentedControl
								id={$embed.captionPosition()}
								controls={captionPositionControls}
								label="Caption position"
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
							<TextFieldWrapper appearance="neutral-filled-underline" size="small">
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
		</FloatingPortal>
	);
};
