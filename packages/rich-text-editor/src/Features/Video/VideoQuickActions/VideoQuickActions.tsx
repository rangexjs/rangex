import type { CaptionPosition } from "@rangex/editor";
import type { VideoAttrsPatch } from "@rangex/editor/video";
import { FloatingPortal, ReadOnly, Video } from "@rangex/solid";
import {
	createEffect,
	createSignal,
	createUniqueId,
	onCleanup,
} from "solid-js";
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
	isObjectFitValue,
	MediaSource,
	type ObjectFitValue,
	OptionDropdown,
	type OptionDropdownOption,
	objectFitAttrName,
} from "../../_Utilities";

const objectFitOptions: OptionDropdownOption<ObjectFitValue>[] = [
	{ label: "Cover", value: "cover" },
	{ label: "Contain", value: "contain" },
	{ label: "Fill", value: "fill" },
];

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

export const VideoQuickActions = () => {
	const editor = useEditorContext();
	const { video, readOnly } = editor;

	if (!video) {
		throw new Error("Video can't be undefined.");
	}

	const $video = Video(video);
	const $readOnly = ReadOnly(readOnly);

	const videoAttrs = () => $video.domAttrs()?.video ?? null;

	const objectFit = (): ObjectFitValue => {
		const value = videoAttrs()?.[objectFitAttrName] ?? null;

		return isObjectFitValue(value) ? value : "cover";
	};

	// An invalid aspect ratio (e.g. from an old snapshot) is shown as "Auto"
	const aspectRatio = (): AspectRatioValue | null => {
		const value = videoAttrs()?.[aspectRatioAttrName] ?? null;

		return isAspectRatioValue(value) ? value : null;
	};

	const hasVideoAttr = (
		attrName: "controls" | "autoplay" | "loop" | "muted",
	) => {
		const value = videoAttrs()?.[attrName] ?? null;

		return value !== null;
	};

	const controls = () => hasVideoAttr("controls");
	const autoplay = () => hasVideoAttr("autoplay");
	const loop = () => hasVideoAttr("loop");
	const muted = () => hasVideoAttr("muted");

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

	createEffect(
		() => videoAttrs()?.poster ?? "",
		(poster) => {
			posterHandle.setValue(poster);
			setCommittedPoster(poster);
		},
	);

	createEffect(
		() => videoAttrs()?.title ?? "",
		(title) => {
			titleHandle.setValue(title);
			setCommittedTitle(title);
		},
	);

	const changeVideoAttrs = (videoAttrsPatch: VideoAttrsPatch["video"]) => {
		if (!video.domAttrs) {
			return;
		}

		const changeFailed = video.changeDOMAttrs({ video: videoAttrsPatch });

		if (changeFailed) {
			console.warn("Video's attributes were rejected.", changeFailed);
		}
	};

	const onObjectFitSelect = (value: ObjectFitValue) => {
		changeVideoAttrs({ [objectFitAttrName]: value });
	};

	const onAspectRatioSelect = (value: AspectRatioValue | null) => {
		changeVideoAttrs({ [aspectRatioAttrName]: value });
	};

	const onControlsToggle = () => {
		changeVideoAttrs({ controls: controls() ? null : "" });
	};

	const onAutoplayToggle = () => {
		if (autoplay()) {
			changeVideoAttrs({ autoplay: null });
			return;
		}

		changeVideoAttrs({ autoplay: "", muted: "" });
	};

	const onLoopToggle = () => {
		changeVideoAttrs({ loop: loop() ? null : "" });
	};

	const onMutedToggle = () => {
		if (autoplay()) {
			return;
		}

		changeVideoAttrs({ muted: muted() ? null : "" });
	};

	const onPosterCommit = () => {
		if (!isPosterDirty()) {
			return;
		}

		const poster = posterHandle.value();

		// An empty poster removes it
		changeVideoAttrs({ poster: poster === "" ? null : poster });
	};

	const onPosterKeyDown = (event: KeyboardEvent) => {
		if (event.key !== "Enter") {
			return;
		}

		onPosterCommit();
	};

	const onTitleCommit = () => {
		if (!isTitleDirty()) {
			return;
		}

		changeVideoAttrs({ title: titleHandle.value() });
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
		video.changeCaptionEnabled(!$video.captionEnabled());
	};

	let blockAlignPopover: HTMLDivElement | undefined;
	let optionsPopover: HTMLDivElement | undefined;
	let mediaSourcePopover: HTMLDivElement | undefined;

	const optionsPopoverId = createUniqueId();

	const closeNestedPopovers = () => {
		const nestedPopovers = [
			blockAlignPopover,
			mediaSourcePopover,
			optionsPopover,
		];

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

	const unsubscribeIsOpen = video.quickActions.onToggle(() => {
		if (!video.quickActions.isOpen) {
			closeNestedPopovers();
		}
	});

	onCleanup(() => {
		unsubscribeIsOpen();
	});

	return (
		<FloatingPortal mount={video.quickActions.element}>
			<div class="z-20 flex items-center gap-1 rounded-md border border-neutral-200 bg-white p-0.5 shadow-xs dark:border-neutral-700 dark:bg-neutral-900">
				<BlockAlign
					value={$video.align()}
					disabled={$readOnly?.checked()}
					onChange={(value) => video.changeAlign(value)}
					popoverRef={(el) => {
						blockAlignPopover = el;
					}}
				/>

				<button
					type="button"
					class="btn-menu-trigger flex items-center justify-center rounded p-1"
					aria-label="Swap video"
					disabled={!video.canSwap || $readOnly?.checked()}
					onClick={onSwapClick}
				>
					<Icon name="Swap" class="size-4" />
				</button>

				<MediaSource
					src={$video.domAttrs()?.video.src ?? null}
					label="Video source"
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
						aria-label="Video options"
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
							notFoundLabel="Custom"
							onSelect={onAspectRatioSelect}
						/>

						<div class="flex items-center justify-between">
							<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">
								Controls
							</span>
							<ToggleButton
								checked={controls()}
								label="Controls"
								onClick={onControlsToggle}
							/>
						</div>

						<div class="flex items-center justify-between">
							<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">
								Autoplay
							</span>
							<ToggleButton
								checked={autoplay()}
								label="Autoplay"
								onClick={onAutoplayToggle}
							/>
						</div>

						<div class="flex items-center justify-between">
							<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">
								Loop
							</span>
							<ToggleButton
								checked={loop()}
								label="Loop"
								onClick={onLoopToggle}
							/>
						</div>

						<div class="flex items-center justify-between">
							<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">
								Muted
							</span>
							<ToggleButton
								checked={muted()}
								label="Muted"
								onClick={onMutedToggle}
							/>
						</div>

						<div class="flex items-center justify-between">
							<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">
								Caption
							</span>
							<ToggleButton
								checked={$video.captionEnabled()}
								label="Caption"
								onClick={onCaptionToggle}
							/>
						</div>

						<div hidden={!$video.captionEnabled()}>
							<SegmentedControl
								id={$video.captionPosition()}
								controls={captionPositionControls}
								label="Caption position"
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
		</FloatingPortal>
	);
};
