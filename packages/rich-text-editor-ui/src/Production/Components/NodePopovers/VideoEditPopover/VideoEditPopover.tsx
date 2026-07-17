import { createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import type {
	UpdateAutoplayFn,
	UpdateControlsFn,
	UpdateLoopFn,
	UpdateMutedFn,
	UpdatePosterFn,
	UpdateTitleFn,
	UpdateVideoAlignFn,
	UpdateVideoAspectRatioFn,
	UpdateVideoCaptionFn,
	UpdateVideoObjectFitFn,
	VideoAspectRatioValue,
	VideoCaptionPosition,
	VideoObjectFitValue,
} from "../../../PopoverControllers";
import { usePopoverControllersContext } from "../../App";
import {
	ContentSwitch,
	type ContentSwitcherControls,
} from "../../ContentSwitcher";
import { Icon } from "../../Icon";
import {
	createTextFieldController,
	InputTextField,
	TextFieldWrapper,
} from "../../InputFields";
import { ToggleButton } from "../../ToggleButton";
import {
	BlockAlign,
	OptionDropdown,
	type OptionDropdownOption,
} from "../_Utilities";

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

const captionPositionControls: ContentSwitcherControls<VideoCaptionPosition> = [
	{ id: "above", node: "Above" },
	{ id: "below", node: "Below" },
];

export const VideoEditPopover = () => {
	const { videoEditPopoverController: controller } =
		usePopoverControllersContext();

	const [align, setAlign] = createSignal(controller.align);
	const [objectFit, setObjectFit] = createSignal(controller.objectFit);
	const [aspectRatio, setAspectRatio] = createSignal(controller.aspectRatio);
	const [caption, setCaption] = createSignal(controller.caption);
	const [controls, setControls] = createSignal(controller.controls);
	const [autoplay, setAutoplay] = createSignal(controller.autoplay);
	const [loop, setLoop] = createSignal(controller.loop);
	const [muted, setMuted] = createSignal(controller.muted);

	const [posterModel, posterControls] = createTextFieldController({
		defaultValue: controller.poster,
	});

	const [committedPoster, setCommittedPoster] = createSignal(controller.poster);

	const isPosterDirty = () => posterModel.value() !== committedPoster();

	const [titleModel, titleControls] = createTextFieldController({
		defaultValue: controller.title,
	});

	const [committedTitle, setCommittedTitle] = createSignal(controller.title);

	const isTitleDirty = () => titleModel.value() !== committedTitle();

	let blockAlignPopover: HTMLDivElement | undefined;
	let optionsPopover: HTMLDivElement | undefined;

	onMount(() => {
		const onAlign: UpdateVideoAlignFn = (value) => setAlign(value);
		const onObjectFit: UpdateVideoObjectFitFn = (value) => setObjectFit(value);
		const onAspectRatio: UpdateVideoAspectRatioFn = (value) =>
			setAspectRatio(value);
		const onCaption: UpdateVideoCaptionFn = (value) => setCaption(value);
		const onControls: UpdateControlsFn = (value) => setControls(value);
		const onAutoplay: UpdateAutoplayFn = (value) => setAutoplay(value);
		const onLoop: UpdateLoopFn = (value) => setLoop(value);
		const onMuted: UpdateMutedFn = (value) => setMuted(value);
		const onPoster: UpdatePosterFn = (value) => {
			posterModel.setValue(value);
			setCommittedPoster(value);
		};
		const onTitle: UpdateTitleFn = (value) => {
			titleModel.setValue(value);
			setCommittedTitle(value);
		};

		controller.subscribe({ type: "align", callback: onAlign });
		controller.subscribe({ type: "objectFit", callback: onObjectFit });
		controller.subscribe({ type: "aspectRatio", callback: onAspectRatio });
		controller.subscribe({ type: "caption", callback: onCaption });
		controller.subscribe({ type: "controls", callback: onControls });
		controller.subscribe({ type: "autoplay", callback: onAutoplay });
		controller.subscribe({ type: "loop", callback: onLoop });
		controller.subscribe({ type: "muted", callback: onMuted });
		controller.subscribe({ type: "poster", callback: onPoster });
		controller.subscribe({ type: "title", callback: onTitle });

		onCleanup(() => {
			controller.unsubscribe({ type: "align", callback: onAlign });
			controller.unsubscribe({ type: "objectFit", callback: onObjectFit });
			controller.unsubscribe({ type: "aspectRatio", callback: onAspectRatio });
			controller.unsubscribe({ type: "caption", callback: onCaption });
			controller.unsubscribe({ type: "controls", callback: onControls });
			controller.unsubscribe({ type: "autoplay", callback: onAutoplay });
			controller.unsubscribe({ type: "loop", callback: onLoop });
			controller.unsubscribe({ type: "muted", callback: onMuted });
			controller.unsubscribe({ type: "poster", callback: onPoster });
			controller.unsubscribe({ type: "title", callback: onTitle });
		});
	});

	const onBeforeToggle = () => {
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

	const optionsPopoverId = createUniqueId();

	const onPosterCommit = () => {
		controller.emitVideoAttrChange({ poster: posterModel.value() });
	};

	const onPosterKeyDown = (event: KeyboardEvent) => {
		if (event.key !== "Enter") {
			return;
		}

		onPosterCommit();
	};

	const onTitleCommit = () => {
		controller.emitVideoAttrChange({ title: titleModel.value() });
	};

	const onTitleKeyDown = (event: KeyboardEvent) => {
		if (event.key !== "Enter") {
			return;
		}

		onTitleCommit();
	};

	const onAutoplayToggle = () => {
		const nextAutoplay = !autoplay();
		const muted = nextAutoplay ? true : undefined;
		controller.emitVideoAttrChange({ autoplay: nextAutoplay, muted });
	};

	return (
		<div
			ref={(el) => controller.setPopover(el)}
			popover="manual"
			class="items-center gap-1 rounded-md border border-neutral-200 bg-white p-0.5 shadow-xs open:flex dark:border-neutral-700 dark:bg-neutral-900"
			on:beforetoggle={onBeforeToggle}
		>
			<BlockAlign
				value={align()}
				onChange={(value) => controller.emitAlignChange(value)}
				popoverRef={(el) => {
					blockAlignPopover = el;
				}}
			/>

			<button
				type="button"
				class="btn-menu-trigger flex items-center justify-center rounded p-1"
				title="Swap"
				on:click={() => controller.emitSwapPopoverOpen()}
			>
				<Icon name="Swap" class="size-4" />
			</button>

			<button
				type="button"
				class="btn-menu-trigger flex items-center justify-center rounded p-1"
				title="Delete"
				on:click={() => controller.emitDelete()}
			>
				<Icon name="Trash" class="size-4" />
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
							controller.emitVideoAttrChange({ objectFit: value })
						}
					/>

					<OptionDropdown
						label="Aspect ratio"
						value={aspectRatio()}
						options={aspectRatioOptions}
						onSelect={(value) =>
							controller.emitVideoAttrChange({ aspectRatio: value })
						}
					/>

					<div class="flex items-center justify-between">
						<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">
							Controls
						</span>
						<ToggleButton
							checked={controls()}
							on:click={() =>
								controller.emitVideoAttrChange({ controls: !controls() })
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
							on:click={() => controller.emitVideoAttrChange({ loop: !loop() })}
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

								controller.emitVideoAttrChange({ muted: !muted() });
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
								controller.emitCaptionEnabledChange(!caption().enabled)
							}
						/>
					</div>

					<div hidden={!caption().enabled}>
						<ContentSwitch
							id={caption().position}
							controls={captionPositionControls}
							onChange={(value) => controller.emitCaptionPositionChange(value)}
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
