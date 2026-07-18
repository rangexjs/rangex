import { createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import type { CaptionPosition } from "#ports";
import type {
	UpdateAudioAlignFn,
	UpdateAudioAutoplayFn,
	UpdateAudioCaptionFn,
	UpdateAudioControlsFn,
	UpdateAudioLoopFn,
	UpdateAudioMutedFn,
	UpdateAudioTitleFn,
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
import { BlockAlign } from "../_Utilities";
import { AudioSwapPopover } from "./AudioSwapPopover";

const captionPositionControls: ContentSwitcherControls<CaptionPosition> = [
	{ id: "above", node: "Above" },
	{ id: "below", node: "Below" },
];

export const AudioPopover = () => {
	const { audioPopoverController: controller } = usePopoverControllersContext();

	const [align, setAlign] = createSignal(controller.align);
	const [caption, setCaption] = createSignal(controller.caption);
	const [controls, setControls] = createSignal(controller.controls);
	const [autoplay, setAutoplay] = createSignal(controller.autoplay);
	const [loop, setLoop] = createSignal(controller.loop);
	const [muted, setMuted] = createSignal(controller.muted);

	const [titleModel, titleControls] = createTextFieldController({
		defaultValue: controller.title,
	});

	const [committedTitle, setCommittedTitle] = createSignal(controller.title);

	const isTitleDirty = () => titleModel.value() !== committedTitle();

	let blockAlignPopover: HTMLDivElement | undefined;
	let optionsPopover: HTMLDivElement | undefined;
	let swapPopover: HTMLDivElement | undefined;

	onMount(() => {
		const onAlign: UpdateAudioAlignFn = (value) => setAlign(value);
		const onCaption: UpdateAudioCaptionFn = (value) => setCaption(value);
		const onControls: UpdateAudioControlsFn = (value) => setControls(value);
		const onAutoplay: UpdateAudioAutoplayFn = (value) => setAutoplay(value);
		const onLoop: UpdateAudioLoopFn = (value) => setLoop(value);
		const onMuted: UpdateAudioMutedFn = (value) => setMuted(value);
		const onTitle: UpdateAudioTitleFn = (value) => {
			titleModel.setValue(value);
			setCommittedTitle(value);
		};

		controller.subscribe({ type: "align", callback: onAlign });
		controller.subscribe({ type: "caption", callback: onCaption });
		controller.subscribe({ type: "controls", callback: onControls });
		controller.subscribe({ type: "autoplay", callback: onAutoplay });
		controller.subscribe({ type: "loop", callback: onLoop });
		controller.subscribe({ type: "muted", callback: onMuted });
		controller.subscribe({ type: "title", callback: onTitle });

		onCleanup(() => {
			controller.unsubscribe({ type: "align", callback: onAlign });
			controller.unsubscribe({ type: "caption", callback: onCaption });
			controller.unsubscribe({ type: "controls", callback: onControls });
			controller.unsubscribe({ type: "autoplay", callback: onAutoplay });
			controller.unsubscribe({ type: "loop", callback: onLoop });
			controller.unsubscribe({ type: "muted", callback: onMuted });
			controller.unsubscribe({ type: "title", callback: onTitle });
		});
	});

	const onBeforeToggle = () => {
		const nestedPopovers = [blockAlignPopover, optionsPopover, swapPopover];

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

	const onTitleCommit = () => {
		controller.emitAudioAttrChange({ title: titleModel.value() });
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
		controller.emitAudioAttrChange({ autoplay: nextAutoplay, muted });
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

			<AudioSwapPopover
				controller={controller}
				popoverRef={(el) => {
					swapPopover = el;
				}}
			/>

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
					<div class="flex items-center justify-between">
						<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">
							Controls
						</span>
						<ToggleButton
							checked={controls()}
							on:click={() =>
								controller.emitAudioAttrChange({ controls: !controls() })
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
							on:click={() => controller.emitAudioAttrChange({ loop: !loop() })}
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

								controller.emitAudioAttrChange({ muted: !muted() });
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
								placeholder="Describe the audio"
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
