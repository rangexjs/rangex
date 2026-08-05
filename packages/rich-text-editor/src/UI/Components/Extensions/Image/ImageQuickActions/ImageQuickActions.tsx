import { createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import type {
	CaptionPosition,
	ImageAspectRatioValue,
	ImageObjectFitValue,
	ImageUIPort,
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

const objectFitOptions: OptionDropdownOption<ImageObjectFitValue>[] = [
	{ label: "Cover", value: "cover" },
	{ label: "Contain", value: "contain" },
	{ label: "Fill", value: "fill" },
];

const aspectRatioOptions: OptionDropdownOption<ImageAspectRatioValue>[] = [
	{ label: "Auto", value: "auto" },
	{ label: "1:1", value: "1-1" },
	{ label: "4:3", value: "4-3" },
	{ label: "16:9", value: "16-9" },
];

const captionPositionControls: ContentSwitcherControls<CaptionPosition> = [
	{ id: "above", node: "Above" },
	{ id: "below", node: "Below" },
];

interface ImageQuickActionsProps {
	uiPort: ImageUIPort;
}

export const ImageQuickActions = (props: ImageQuickActionsProps) => {
	const uiPort = props.uiPort;

	const [align, setAlign] = createSignal(uiPort.align);
	const [objectFit, setObjectFit] = createSignal(uiPort.objectFit);
	const [aspectRatio, setAspectRatio] = createSignal(uiPort.aspectRatio);
	const [caption, setCaption] = createSignal(uiPort.caption);
	const [isSwapCardOpen, setIsSwapCardOpen] = createSignal(
		uiPort.isSwapCardOpen,
	);

	const [altModel, altControls] = createTextFieldController({
		defaultValue: uiPort.altText,
	});

	const [committedAltText, setCommittedAltText] = createSignal(uiPort.altText);

	const isAltTextDirty = () => altModel.value() !== committedAltText();

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
		const unsubscribeAltText = uiPort.onAltTextUpdate((value) => {
			altModel.setValue(value);
			setCommittedAltText(value);
		});
		const unsubscribeIsSwapCardOpen =
			uiPort.onIsSwapCardOpenUpdate(setIsSwapCardOpen);
		const unsubscribeIsQuickActionsOpen =
			uiPort.onIsQuickActionsOpenUpdate(closeNestedPopovers);

		onCleanup(() => {
			unsubscribeAlign();
			unsubscribeObjectFit();
			unsubscribeAspectRatio();
			unsubscribeCaption();
			unsubscribeAltText();
			unsubscribeIsSwapCardOpen();
			unsubscribeIsQuickActionsOpen();
		});
	});

	const optionsPopoverId = createUniqueId();

	const onAltTextCommit = () => {
		uiPort.emitImageAttrChange({ altText: altModel.value() });
	};

	const onAltTextKeyDown = (event: KeyboardEvent) => {
		if (event.key !== "Enter") {
			return;
		}

		onAltTextCommit();
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
				data-is-checked={isSwapCardOpen()}
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
					class="w-44 space-y-2 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm [position-area:center_bottom] dark:border-neutral-700 dark:bg-neutral-900"
				>
					<OptionDropdown
						label="Object fit"
						value={objectFit()}
						options={objectFitOptions}
						onSelect={(value) =>
							uiPort.emitImageAttrChange({ objectFit: value })
						}
					/>

					<OptionDropdown
						label="Aspect ratio"
						value={aspectRatio()}
						options={aspectRatioOptions}
						onSelect={(value) =>
							uiPort.emitImageAttrChange({ aspectRatio: value })
						}
					/>

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
								for={altModel.id}
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
								id={altModel.id}
								placeholder="Describe the image"
								spellcheck={false}
								{...altControls}
								on:blur={onAltTextCommit}
								on:keydown={onAltTextKeyDown}
							/>
						</TextFieldWrapper>
					</div>
				</div>
			</span>
		</div>
	);
};
