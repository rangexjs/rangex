import type { CaptionPosition } from "@rangex/editor";
import { Audio, FloatingPortal, ReadOnly } from "@rangex/solid";
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
import { BlockAlign } from "../../_Utilities";

const captionPositionControls: SegmentedControlControls<CaptionPosition> = [
	{ id: "above", node: "Above" },
	{ id: "below", node: "Below" },
];

export const AudioQuickActions = () => {
	const editor = useEditorContext();
	const { audio, readOnly } = editor;

	if (!audio) {
		throw new Error("Audio can't be undefined.");
	}

	const $audio = Audio(audio);
	const $readOnly = ReadOnly(readOnly);

	const audioElement = () => {
		const currentBlock = $audio.currentComponent();

		return currentBlock?.querySelector<HTMLAudioElement>("audio") ?? null;
	};

	const [controls, setControlsSignal] = createSignal(false);
	const [autoplay, setAutoplaySignal] = createSignal(false);
	const [loop, setLoopSignal] = createSignal(false);
	const [muted, setMutedSignal] = createSignal(false);

	const [titleHandle, titleControls] = createTextFieldState<HTMLInputElement>({
		defaultValue: "",
	});

	const [committedTitle, setCommittedTitle] = createSignal("");

	const isTitleDirty = () => titleHandle.value() !== committedTitle();

	const syncFromAudio = (audioEl: HTMLAudioElement) => {
		setControlsSignal(audioEl.hasAttribute("controls"));
		setAutoplaySignal(audioEl.hasAttribute("autoplay"));
		setLoopSignal(audioEl.hasAttribute("loop"));
		setMutedSignal(audioEl.hasAttribute("muted"));

		titleHandle.setValue(audioEl.title);
		setCommittedTitle(audioEl.title);
	};

	createEffect(
		() => audioElement(),
		(audioEl) => {
			if (!audioEl) {
				return;
			}

			syncFromAudio(audioEl);

			const observer = new MutationObserver(() => {
				syncFromAudio(audioEl);
			});

			observer.observe(audioEl, {
				attributes: true,
				attributeFilter: ["controls", "autoplay", "loop", "muted", "title"],
			});

			return () => {
				observer.disconnect();
			};
		},
	);

	const onControlsToggle = () => {
		const audioEl = audioElement();

		if (!audioEl) {
			return;
		}

		if (controls()) {
			audioEl.removeAttribute("controls");
		} else {
			audioEl.setAttribute("controls", "");
		}
	};

	const onAutoplayToggle = () => {
		const audioEl = audioElement();

		if (!audioEl) {
			return;
		}

		const nextAutoplay = !autoplay();

		if (nextAutoplay) {
			audioEl.setAttribute("autoplay", "");
			audioEl.setAttribute("muted", "");
		} else {
			audioEl.removeAttribute("autoplay");
		}
	};

	const onLoopToggle = () => {
		const audioEl = audioElement();

		if (!audioEl) {
			return;
		}

		if (loop()) {
			audioEl.removeAttribute("loop");
		} else {
			audioEl.setAttribute("loop", "");
		}
	};

	const onMutedToggle = () => {
		if (autoplay()) {
			return;
		}

		const audioEl = audioElement();

		if (!audioEl) {
			return;
		}

		if (muted()) {
			audioEl.removeAttribute("muted");
		} else {
			audioEl.setAttribute("muted", "");
		}
	};

	const onTitleCommit = () => {
		const audioEl = audioElement();

		if (!audioEl) {
			return;
		}

		audioEl.title = titleHandle.value();
	};

	const onTitleKeyDown = (event: KeyboardEvent) => {
		if (event.key !== "Enter") {
			return;
		}

		onTitleCommit();
	};

	const onSwapClick = () => {
		audio.swap();
	};

	const onCaptionToggle = () => {
		audio.changeCaptionEnabled(!$audio.captionEnabled());
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

	const unsubscribeIsOpen = audio.quickActions.onToggle(() => {
		if (!audio.quickActions.isOpen) {
			closeNestedPopovers();
		}
	});

	onCleanup(() => {
		unsubscribeIsOpen();
	});

	return (
		<FloatingPortal mount={audio.quickActions.element}>
			<div class="z-20 flex items-center gap-1 rounded-md border border-neutral-200 bg-white p-0.5 shadow-xs dark:border-neutral-700 dark:bg-neutral-900">
				<BlockAlign
					value={$audio.align()}
					disabled={$readOnly?.checked()}
					onChange={(value) => audio.changeAlign(value)}
					popoverRef={(el) => {
						blockAlignPopover = el;
					}}
				/>

				<button
					type="button"
					class="btn-menu-trigger flex items-center justify-center rounded p-1"
					aria-label="Swap audio"
					disabled={!audio.canSwap || $readOnly?.checked()}
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
						aria-label="Audio options"
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
								checked={$audio.captionEnabled()}
								label="Caption"
								onClick={onCaptionToggle}
							/>
						</div>

						<div hidden={!$audio.captionEnabled()}>
							<SegmentedControl
								id={$audio.captionPosition()}
								controls={captionPositionControls}
								label="Caption position"
								onChange={(value) => audio.changeCaptionPosition(value)}
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
									placeholder="Describe the audio"
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
