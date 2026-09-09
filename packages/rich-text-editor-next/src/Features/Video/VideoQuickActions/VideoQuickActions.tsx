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
	getObjectFit,
	type ObjectFitValue,
	OptionDropdown,
	type OptionDropdownOption,
	objectFitAttrName,
	setAspectRatio,
	setObjectFit,
} from "../../_Utilities";

const objectFitOptions: OptionDropdownOption<ObjectFitValue>[] = [
	{ label: "Cover", value: "cover" },
	{ label: "Contain", value: "contain" },
	{ label: "Fill", value: "fill" },
];

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

export const VideoQuickActions = () => {
	const { video, readOnly } = useReactiveEditorContext();
	const editor = useEditorContext();

	if (!(video && editor.video)) {
		throw new Error("Video can't be undefined.");
	}

	const caption = () => video.caption();

	const videoElement = () => {
		const currentBlock = video.currentBlock();

		return currentBlock?.querySelector<HTMLVideoElement>("video") ?? null;
	};

	const [objectFit, setObjectFitSignal] = createSignal<ObjectFitValue>("cover");
	const [aspectRatio, setAspectRatioSignal] =
		createSignal<AspectRatioValue>("auto");
	const [controls, setControlsSignal] = createSignal(false);
	const [autoplay, setAutoplaySignal] = createSignal(false);
	const [loop, setLoopSignal] = createSignal(false);
	const [muted, setMutedSignal] = createSignal(false);

	const [posterHandle, posterControls] = createTextFieldState<HTMLInputElement>(
		{
			defaultValue: "",
		},
	);

	const [committedPoster, setCommittedPoster] = createSignal("");

	const isPosterDirty = () => posterHandle.value() !== committedPoster();

	const [titleHandle, titleControls] = createTextFieldState<HTMLInputElement>({
		defaultValue: "",
	});

	const [committedTitle, setCommittedTitle] = createSignal("");

	const isTitleDirty = () => titleHandle.value() !== committedTitle();

	const syncFromVideo = (videoEl: HTMLVideoElement) => {
		const objectFitValue = getObjectFit(videoEl) ?? "cover";
		const aspectRatioValue = getAspectRatio(videoEl) ?? "auto";

		setObjectFitSignal(objectFitValue);
		setAspectRatioSignal(aspectRatioValue);

		setControlsSignal(videoEl.hasAttribute("controls"));
		setAutoplaySignal(videoEl.hasAttribute("autoplay"));
		setLoopSignal(videoEl.hasAttribute("loop"));
		setMutedSignal(videoEl.hasAttribute("muted"));

		const poster = videoEl.getAttribute("poster") ?? "";

		posterHandle.setValue(poster);
		setCommittedPoster(poster);

		titleHandle.setValue(videoEl.title);
		setCommittedTitle(videoEl.title);
	};

	createEffect(
		() => videoElement(),
		(videoEl) => {
			if (!videoEl) {
				return;
			}

			syncFromVideo(videoEl);

			const observer = new MutationObserver(() => {
				syncFromVideo(videoEl);
			});

			observer.observe(videoEl, {
				attributes: true,
				attributeFilter: [
					objectFitAttrName,
					aspectRatioAttrName,
					"controls",
					"autoplay",
					"loop",
					"muted",
					"poster",
					"title",
				],
			});

			return () => {
				observer.disconnect();
			};
		},
	);

	const onObjectFitSelect = (value: ObjectFitValue) => {
		const videoEl = videoElement();

		if (!videoEl) {
			return;
		}

		setObjectFit(videoEl, value);
		video.commitSnapshot();
	};

	const onAspectRatioSelect = (value: AspectRatioValue) => {
		const videoEl = videoElement();

		if (!videoEl) {
			return;
		}

		setAspectRatio(videoEl, value);
		video.commitSnapshot();
	};

	const onControlsToggle = () => {
		const videoEl = videoElement();

		if (!videoEl) {
			return;
		}

		if (controls()) {
			videoEl.removeAttribute("controls");
		} else {
			videoEl.setAttribute("controls", "");
		}

		video.commitSnapshot();
	};

	const onAutoplayToggle = () => {
		const videoEl = videoElement();

		if (!videoEl) {
			return;
		}

		const nextAutoplay = !autoplay();

		if (nextAutoplay) {
			videoEl.setAttribute("autoplay", "");
			videoEl.setAttribute("muted", "");
		} else {
			videoEl.removeAttribute("autoplay");
		}

		video.commitSnapshot();
	};

	const onLoopToggle = () => {
		const videoEl = videoElement();

		if (!videoEl) {
			return;
		}

		if (loop()) {
			videoEl.removeAttribute("loop");
		} else {
			videoEl.setAttribute("loop", "");
		}

		video.commitSnapshot();
	};

	const onMutedToggle = () => {
		if (autoplay()) {
			return;
		}

		const videoEl = videoElement();

		if (!videoEl) {
			return;
		}

		if (muted()) {
			videoEl.removeAttribute("muted");
		} else {
			videoEl.setAttribute("muted", "");
		}

		video.commitSnapshot();
	};

	const onPosterCommit = () => {
		const videoEl = videoElement();

		if (!videoEl) {
			return;
		}

		videoEl.poster = posterHandle.value();
		video.commitSnapshot();
	};

	const onPosterKeyDown = (event: KeyboardEvent) => {
		if (event.key !== "Enter") {
			return;
		}

		onPosterCommit();
	};

	const onTitleCommit = () => {
		const videoEl = videoElement();

		if (!videoEl) {
			return;
		}

		videoEl.title = titleHandle.value();
		video.commitSnapshot();
	};

	const onTitleKeyDown = (event: KeyboardEvent) => {
		if (event.key !== "Enter") {
			return;
		}

		onTitleCommit();
	};

	const onSwapClick = () => {
		video.swap();
	};

	const onCaptionToggle = () => {
		if (readOnly?.checked()) {
			return;
		}

		video.changeCaptionEnabled(!caption().enabled);
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

	// We can't rely on video.quickActionsOpen() as we have to detect the change before repaint
	const unsubscribeIsOpen = editor.video.onQuickActionsOpenUpdate((open) => {
		if (!open) {
			closeNestedPopovers();
		}
	});

	onCleanup(() => {
		unsubscribeIsOpen();
	});

	return (
		<Portal mount={video.quickActionsEl}>
			<div class="z-20 flex items-center gap-1 rounded-md border border-neutral-200 bg-white p-0.5 shadow-xs dark:border-neutral-700 dark:bg-neutral-900">
				<BlockAlign
					value={video.align()}
					disabled={readOnly?.checked()}
					onChange={(value) => video.changeAlign(value)}
					popoverRef={(el) => {
						blockAlignPopover = el;
					}}
				/>

				<button
					type="button"
					class="btn-menu-trigger flex items-center justify-center rounded p-1"
					title="Swap"
					disabled={!video.canSwap || readOnly?.checked()}
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
						class="w-52 space-y-2 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm [position-area:center_bottom] dark:border-neutral-700 dark:bg-neutral-900"
					>
						<OptionDropdown
							label="Object fit"
							value={objectFit()}
							options={objectFitOptions}
							onSelect={onObjectFitSelect}
						/>

						<OptionDropdown
							label="Aspect ratio"
							value={aspectRatio()}
							options={aspectRatioOptions}
							onSelect={onAspectRatioSelect}
						/>

						<div class="flex items-center justify-between">
							<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">
								Controls
							</span>
							<ToggleButton checked={controls()} onClick={onControlsToggle} />
						</div>

						<div class="flex items-center justify-between">
							<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">
								Autoplay
							</span>
							<ToggleButton checked={autoplay()} onClick={onAutoplayToggle} />
						</div>

						<div class="flex items-center justify-between">
							<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">
								Loop
							</span>
							<ToggleButton checked={loop()} onClick={onLoopToggle} />
						</div>

						<div class="flex items-center justify-between">
							<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">
								Muted
							</span>
							<ToggleButton checked={muted()} onClick={onMutedToggle} />
						</div>

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
								onChange={(value) => video.changeCaptionPosition(value)}
								appearance="primary-outline"
								class="rounded-sm"
								commonButtonClass="rounded-sm py-1 font-medium text-xs"
							/>
						</div>

						<div class="flex flex-col gap-1">
							<div class="flex items-center justify-between">
								<label
									for={posterHandle.id}
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
									placeholder="https://example.com/poster.png"
									spellcheck={false}
									{...posterControls}
									onBlur={onPosterCommit}
									onKeyDown={onPosterKeyDown}
								/>
							</TextFieldWrapper>
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
									placeholder="Describe the video"
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
