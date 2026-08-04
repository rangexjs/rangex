import { createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import type {
	CaptionPosition,
	VideoAspectRatioValue,
	VideoObjectFitValue,
	VideoUIPort,
} from "#adapters";
import {
	ContentSwitch,
	type ContentSwitcherControls,
} from "../../../ContentSwitcher";
import { Icon } from "../../../Icon";
import {
	createTextFieldController,
	InputTextField,
	TextFieldWrapper,
} from "../../../InputFields";
import { ToggleButton } from "../../../ToggleButton";
import {
	BlockAlign,
	OptionDropdown,
	type OptionDropdownOption,
} from "../../_Utilities";

const objectFitOptions: OptionDropdownOption<VideoObjectFitValue>[] = [
	{ label: "Cover", value: "cover" },
	{ label: "Contain", value: "contain" },
	{ label: "Fill", value: "fill" },
];

const aspectRatioOptions: OptionDropdownOption<VideoAspectRatioValue>[] = [
	{ label: "Auto", value: "auto" },
	{ label: "1:1", value: "1-1" },
	{ label: "4:3", value: "4-3" },
	{ label: "16:9", value: "16-9" },
];

const captionPositionControls: ContentSwitcherControls<CaptionPosition> = [
	{ id: "above", node: "Above" },
	{ id: "below", node: "Below" },
];

interface VideoQuickActionsProps {
	uiPort: VideoUIPort;
}

export const VideoQuickActions = (props: VideoQuickActionsProps) => {
	const uiPort = props.uiPort;

	const [align, setAlign] = createSignal(uiPort.align);
	const [objectFit, setObjectFit] = createSignal(uiPort.objectFit);
	const [aspectRatio, setAspectRatio] = createSignal(uiPort.aspectRatio);
	const [caption, setCaption] = createSignal(uiPort.caption);
	const [controls, setControls] = createSignal(uiPort.controls);
	const [autoplay, setAutoplay] = createSignal(uiPort.autoplay);
	const [loop, setLoop] = createSignal(uiPort.loop);
	const [muted, setMuted] = createSignal(uiPort.muted);
	const [swapIsOpen, setSwapIsOpen] = createSignal(uiPort.swapIsOpen);

	const [posterModel, posterControls] = createTextFieldController({
		defaultValue: uiPort.poster,
	});

	const [committedPoster, setCommittedPoster] = createSignal(uiPort.poster);

	const isPosterDirty = () => posterModel.value() !== committedPoster();

	const [titleModel, titleControls] = createTextFieldController({
		defaultValue: uiPort.title,
	});

	const [committedTitle, setCommittedTitle] = createSignal(uiPort.title);

	const isTitleDirty = () => titleModel.value() !== committedTitle();

	let blockAlignPopover: HTMLDivElement | undefined;
	let optionsPopover: HTMLDivElement | undefined;

	const closeNestedPopovers = () => {
		const nestedPopovers = [blockAlignPopover, optionsPopover];

		for (const nestedPopover of nestedPopovers) {
			if (!nestedPopover) {
				throw new Error("Nested popover shouldn't be undefined.");
			}

			if (nestedPopover.matches(":popover-open")) {
				nestedPopover.hidePopover();
			}
		}
	};

	onMount(() => {
		const unsubscribeAlign = uiPort.onAlignUpdate(setAlign);
		const unsubscribeObjectFit = uiPort.onObjectFitUpdate(setObjectFit);
		const unsubscribeAspectRatio = uiPort.onAspectRatioUpdate(setAspectRatio);
		const unsubscribeCaption = uiPort.onCaptionUpdate(setCaption);
		const unsubscribeControls = uiPort.onControlsUpdate(setControls);
		const unsubscribeAutoplay = uiPort.onAutoplayUpdate(setAutoplay);
		const unsubscribeLoop = uiPort.onLoopUpdate(setLoop);
		const unsubscribeMuted = uiPort.onMutedUpdate(setMuted);
		const unsubscribePoster = uiPort.onPosterUpdate((value) => {
			posterModel.setValue(value);
			setCommittedPoster(value);
		});
		const unsubscribeTitle = uiPort.onTitleUpdate((value) => {
			titleModel.setValue(value);
			setCommittedTitle(value);
		});
		const unsubscribeSwapIsOpen = uiPort.onSwapIsOpenUpdate(setSwapIsOpen);
		// The main overlay closing (or reopening over a different video) doesn't automatically
		// close these native nested popovers — they're independent top-layer elements.
		const unsubscribeIsOpen = uiPort.onIsOpenUpdate(closeNestedPopovers);

		onCleanup(() => {
			unsubscribeAlign();
			unsubscribeObjectFit();
			unsubscribeAspectRatio();
			unsubscribeCaption();
			unsubscribeControls();
			unsubscribeAutoplay();
			unsubscribeLoop();
			unsubscribeMuted();
			unsubscribePoster();
			unsubscribeTitle();
			unsubscribeSwapIsOpen();
			unsubscribeIsOpen();
		});
	});

	const optionsPopoverId = createUniqueId();

	const onPosterCommit = () => {
		uiPort.emitVideoAttrChange({ poster: posterModel.value() });
	};

	const onPosterKeyDown = (event: KeyboardEvent) => {
		if (event.key !== "Enter") {
			return;
		}

		onPosterCommit();
	};

	const onTitleCommit = () => {
		uiPort.emitVideoAttrChange({ title: titleModel.value() });
	};

	const onTitleKeyDown = (event: KeyboardEvent) => {
		if (event.key !== "Enter") {
			return;
		}

		onTitleCommit();
	};

	const onAutoplayToggle = () => {
		const nextAutoplay = !autoplay();
		const nextMuted = nextAutoplay ? true : undefined;
		uiPort.emitVideoAttrChange({ autoplay: nextAutoplay, muted: nextMuted });
	};

	return (
		<div
			ref={(el) => uiPort.quickActionsOverlay.setElement(el)}
			class="z-20 flex items-center gap-1 rounded-md border border-neutral-200 bg-white p-0.5 shadow-xs dark:border-neutral-700 dark:bg-neutral-900"
		>
			<BlockAlign
				value={align()}
				onChange={(value) => uiPort.emitAlignChange(value)}
				popoverRef={(el) => {
					blockAlignPopover = el;
				}}
			/>

			<button
				type="button"
				class="btn-menu-trigger flex items-center justify-center rounded p-1"
				data-is-checked={swapIsOpen()}
				title="Swap"
				on:click={() => uiPort.emitToggleSwap()}
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
				>
					<Icon name="DotsThreeHorizontal" class="size-4" />
				</button>

				<div
					ref={(el) => {
						optionsPopover = el;
					}}
					id={optionsPopoverId}
					popover="auto"
					class="w-52 space-y-2 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm [position-area:center_bottom] dark:border-neutral-700 dark:bg-neutral-900"
				>
					<OptionDropdown
						label="Object fit"
						value={objectFit()}
						options={objectFitOptions}
						onSelect={(value) =>
							uiPort.emitVideoAttrChange({ objectFit: value })
						}
					/>

					<OptionDropdown
						label="Aspect ratio"
						value={aspectRatio()}
						options={aspectRatioOptions}
						onSelect={(value) =>
							uiPort.emitVideoAttrChange({ aspectRatio: value })
						}
					/>

					<div class="flex items-center justify-between">
						<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">
							Controls
						</span>
						<ToggleButton
							checked={controls()}
							on:click={() =>
								uiPort.emitVideoAttrChange({ controls: !controls() })
							}
						/>
					</div>

					<div class="flex items-center justify-between">
						<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">
							Autoplay
						</span>
						<ToggleButton checked={autoplay()} on:click={onAutoplayToggle} />
					</div>

					<div class="flex items-center justify-between">
						<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">
							Loop
						</span>
						<ToggleButton
							checked={loop()}
							on:click={() => uiPort.emitVideoAttrChange({ loop: !loop() })}
						/>
					</div>

					<div class="flex items-center justify-between">
						<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">
							Muted
						</span>
						<ToggleButton
							checked={muted()}
							on:click={() => {
								if (autoplay()) {
									return;
								}

								uiPort.emitVideoAttrChange({ muted: !muted() });
							}}
						/>
					</div>

					<div class="flex items-center justify-between">
						<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">
							Caption
						</span>
						<ToggleButton
							checked={caption().enabled}
							on:click={() =>
								uiPort.emitCaptionEnabledChange(!caption().enabled)
							}
						/>
					</div>

					<div hidden={!caption().enabled}>
						<ContentSwitch
							id={caption().position}
							controls={captionPositionControls}
							onChange={(value) => uiPort.emitCaptionPositionChange(value)}
							class="rounded-sm"
							commonButtonClass="rounded-sm py-1.5 text-xs font-medium"
							activeBoxShrink={-1}
							activeBoxClass="rounded-sm shadow border border-primary-500/40"
						/>
					</div>

					<div class="flex flex-col gap-1">
						<div class="flex items-center justify-between">
							<label
								for={posterModel.id}
								class="font-medium text-neutral-600 text-xs dark:text-neutral-300"
							>
								Poster
							</label>
							<span
								class="text-neutral-500 text-xs dark:text-neutral-400"
								hidden={!isPosterDirty()}
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
								id={posterModel.id}
								placeholder="https://example.com/poster.png"
								spellcheck={false}
								{...posterControls}
								on:blur={onPosterCommit}
								on:keydown={onPosterKeyDown}
							/>
						</TextFieldWrapper>
					</div>

					<div class="flex flex-col gap-1">
						<div class="flex items-center justify-between">
							<label
								for={titleModel.id}
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
								id={titleModel.id}
								placeholder="Describe the video"
								spellcheck={false}
								{...titleControls}
								on:blur={onTitleCommit}
								on:keydown={onTitleKeyDown}
							/>
						</TextFieldWrapper>
					</div>
				</div>
			</span>
		</div>
	);
};
