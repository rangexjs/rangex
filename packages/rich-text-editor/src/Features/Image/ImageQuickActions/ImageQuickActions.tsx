import type { CaptionPosition } from "@rangex/editor";
import { FloatingPortal, Image, ReadOnly } from "@rangex/solid";
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

export const ImageQuickActions = () => {
	const editor = useEditorContext();
	const { image, readOnly } = editor;

	if (!image) {
		throw new Error("Image can't be undefined.");
	}

	const $image = Image(image);
	const $readOnly = ReadOnly(readOnly);

	const img = () => {
		const currentBlock = $image.currentComponent();

		return currentBlock?.querySelector<HTMLImageElement>("img") ?? null;
	};

	const [objectFit, setObjectFitSignal] = createSignal<ObjectFitValue>("cover");
	const [aspectRatio, setAspectRatioSignal] =
		createSignal<AspectRatioValue>("auto");

	const [altHandle, altControls] = createTextFieldState<HTMLInputElement>({
		defaultValue: "",
	});

	const [committedAltText, setCommittedAltText] = createSignal("");

	const isAltTextDirty = () => altHandle.value() !== committedAltText();

	const syncFromImg = (imgEl: HTMLImageElement) => {
		const objectFitValue = getObjectFit(imgEl) ?? "cover";
		const aspectRatioValue = getAspectRatio(imgEl) ?? "auto";

		setObjectFitSignal(objectFitValue);
		setAspectRatioSignal(aspectRatioValue);

		altHandle.setValue(imgEl.alt);
		setCommittedAltText(imgEl.alt);
	};

	createEffect(
		() => img(),
		(imgEl) => {
			if (!imgEl) {
				return;
			}

			syncFromImg(imgEl);

			const observer = new MutationObserver(() => {
				syncFromImg(imgEl);
			});

			observer.observe(imgEl, {
				attributes: true,
				attributeFilter: [objectFitAttrName, aspectRatioAttrName, "alt"],
			});

			return () => {
				observer.disconnect();
			};
		},
	);

	const onObjectFitSelect = (value: ObjectFitValue) => {
		const imgEl = img();

		if (!imgEl) {
			return;
		}

		setObjectFit(imgEl, value);
		editor.snapshot.commit();
	};

	const onAspectRatioSelect = (value: AspectRatioValue) => {
		const imgEl = img();

		if (!imgEl) {
			return;
		}

		setAspectRatio(imgEl, value);
		editor.snapshot.commit();
	};

	const onAltTextCommit = () => {
		const imgEl = img();

		if (!imgEl) {
			return;
		}

		imgEl.alt = altHandle.value();
	};

	const onAltTextKeyDown = (event: KeyboardEvent) => {
		if (event.key !== "Enter") {
			return;
		}

		onAltTextCommit();
	};

	const onSwapClick = () => {
		image.swap();
	};

	const onCaptionToggle = () => {
		image.changeCaptionEnabled(!$image.captionEnabled());
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

	const unsubscribeIsOpen = image.quickActions.onToggle(() => {
		if (!image.quickActions.isOpen) {
			closeNestedPopovers();
		}
	});

	onCleanup(() => {
		unsubscribeIsOpen();
	});

	return (
		<FloatingPortal mount={image.quickActions.element}>
			<div class="z-20 flex items-center gap-1 rounded-md border border-neutral-200 bg-white p-0.5 shadow-xs dark:border-neutral-700 dark:bg-neutral-900">
				<BlockAlign
					value={$image.align()}
					disabled={$readOnly?.checked()}
					onChange={(value) => image.changeAlign(value)}
					popoverRef={(el) => {
						blockAlignPopover = el;
					}}
				/>

				<button
					type="button"
					class="btn-menu-trigger flex items-center justify-center rounded p-1"
					title="Swap"
					disabled={!image.canSwap || $readOnly?.checked()}
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
								Caption
							</span>
							<ToggleButton
								checked={$image.captionEnabled()}
								onClick={onCaptionToggle}
							/>
						</div>

						<div hidden={!$image.captionEnabled()}>
							<SegmentedControl
								id={$image.captionPosition()}
								controls={captionPositionControls}
								onChange={(value) => image.changeCaptionPosition(value)}
								appearance="primary-outline"
								class="rounded-sm"
								commonButtonClass="rounded-sm py-1 font-medium text-xs"
							/>
						</div>

						<div class="flex flex-col gap-1">
							<div class="flex items-center justify-between">
								<label
									for={altHandle.id}
									class="font-medium text-neutral-600 text-xs dark:text-neutral-300"
								>
									Alt text
								</label>
								<span
									class="text-neutral-500 text-xs dark:text-neutral-400"
									hidden={!isAltTextDirty()}
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
									placeholder="Describe the image"
									spellcheck={false}
									{...altControls}
									onBlur={onAltTextCommit}
									onKeyDown={onAltTextKeyDown}
								/>
							</TextFieldWrapper>
						</div>
					</div>
				</span>
			</div>
		</FloatingPortal>
	);
};
