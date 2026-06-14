import {
	createEffect,
	createMemo,
	createSignal,
	createUniqueId,
	Index,
	onCleanup,
	onMount,
	Show,
} from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import type { FindReplaceSearchResult } from "../../../ToolbarButtonProps";
import type { FindReplaceActionType } from "../../../ToolbarButtonsActionManager";
import { createDebounce } from "../../../Utilities";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import {
	Checkbox,
	type CheckboxControls,
	createCheckboxController,
	createTextFieldController,
	FormField,
	InputTextField,
	TextFieldWrapper,
} from "../../InputFields";
import { Spinning } from "../../Spinning";
import { ToolbarButton } from "../_Utilities";
import { FindReplaceResults } from "./FindReplaceResults";

type CheckboxFilterList = { controls: CheckboxControls; text: string }[][];

export const FindReplaceToolbarButton = () => {
	const {
		toolbarButtonsActionManager,
		nonCategorizedOperationButtonsStateManager,
	} = useToolbarButtonManagersContext();

	const { findReplace } = nonCategorizedOperationButtonsStateManager;

	const [checked, setChecked] = createSignal(false);
	const [isFindLoading, setIsFindLoading] = createSignal(false);
	const [currentIndex, setCurrentIndex] = createSignal(
		findReplace.currentIndex,
	);
	const [totalResults, setTotalResults] = createSignal(
		findReplace.totalResults,
	);
	const [results, setResults] = createSignal<FindReplaceSearchResult[]>(
		findReplace.results,
	);

	const displayIndex = createMemo(() =>
		totalResults() > 0 ? currentIndex() + 1 : 0,
	);

	const popoverId = createUniqueId();

	const findReplaceCallback = (state: typeof findReplace) => {
		setCurrentIndex(state.currentIndex);
		setTotalResults(state.totalResults);
		setResults(state.results);
	};

	onMount(() => {
		nonCategorizedOperationButtonsStateManager.subscribe({
			type: toolbarButtonsName.findReplace,
			callback: findReplaceCallback,
		});
	});

	onCleanup(() => {
		nonCategorizedOperationButtonsStateManager.unsubscribe({
			type: toolbarButtonsName.findReplace,
			callback: findReplaceCallback,
		});
	});

	const isValidRegex = (value: string) => {
		try {
			new RegExp(value);
			return true;
		} catch {
			return false;
		}
	};

	const [useRegexModel, useRegexControls] = createCheckboxController({});

	const [findModel, findControls] = createTextFieldController({
		error: {
			custom: {
				isValid: (value) => {
					return useRegexModel.checked() ? isValidRegex(value) : true;
				},
				message: "Invalid regular expression.",
			},
		},
		validateOnChange: true,
	});
	const [replaceModel, replaceControls] = createTextFieldController({});
	const [matchCaseModel, matchCaseControls] = createCheckboxController({});
	const [wholeWordModel, wholeWordControls] = createCheckboxController({});
	const [includeNonEditableContentModel, includeNonEditableContentControls] =
		createCheckboxController({});
	const [hasFindFocus, setHasFindFocus] = createSignal(false);
	const [replaceDisabled, setReplaceDisabled] = createSignal(false);
	const [isFirstOpening, setIsFirstOpening] = createSignal(true);

	createEffect(() => {
		setReplaceDisabled(totalResults() === 0 || findModel.state().showError);
	});

	const findInputAnchorName = "--find-input-anchor-name";

	const setPopoverInitialPosition = (event: ToggleEvent) => {
		const { newState, currentTarget } = event;

		if (newState === "closed" || !isFirstOpening()) {
			return;
		}

		setIsFirstOpening(false);

		if (!(currentTarget instanceof HTMLElement)) {
			throw new Error("CurrentTarget's type is invalid.");
		}

		Object.assign(currentTarget.style, {
			top: "50%",
			left: "50%",
			transform: "translate(-50%, -50%)",
		});
	};

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState, currentTarget } = event;

		setChecked(newState === "open");

		toolbarButtonsActionManager.emitNonCategorizedOperationChange({
			type: toolbarButtonsName.findReplace,
			action: newState === "open" ? "popover-open" : "popover-closed",
			navigateTo: 0,
			findText: findModel.value(),
			replaceText: replaceModel.value(),
			matchCase: matchCaseModel.checked(),
			wholeWord: wholeWordModel.checked(),
			useRegex: useRegexModel.checked(),
			includeNonEditableContent: includeNonEditableContentModel.checked(),
		});

		if (!(currentTarget instanceof HTMLElement)) {
			throw new Error("CurrentTarget's type is invalid.");
		}

		const { left, right, top, bottom } = currentTarget.getBoundingClientRect();

		const isOutOfViewport =
			left < 0 || right > innerWidth || top < 0 || bottom > innerHeight;

		if (!isOutOfViewport) {
			return;
		}

		Object.assign(currentTarget.style, {
			top: "50%",
			left: "50%",
			transform: "translate(-50%, -50%)",
		});
	};

	const movePopover = (pointerDownEvent: PointerEvent) => {
		pointerDownEvent.preventDefault();
		const { pointerId, currentTarget, clientX, clientY } = pointerDownEvent;

		if (!(currentTarget instanceof HTMLElement)) {
			throw new Error("CurrentTarget's type is invalid.");
		}

		const popover = currentTarget.closest<HTMLElement>(`#${popoverId}`);

		if (!popover) {
			throw new Error("Popover can't be null.");
		}

		const popoverRect = popover.getBoundingClientRect();

		const xDiff = clientX - popoverRect.x;
		const yDiff = clientY - popoverRect.y;

		const controller = new AbortController();
		const { signal } = controller;

		currentTarget.setPointerCapture(pointerId);

		currentTarget.addEventListener(
			"pointermove",
			(pointerMoveEvent) => {
				const numX = Math.min(
					Math.max(0, pointerMoveEvent.clientX - xDiff),
					innerWidth - popoverRect.width,
				);
				const numY = Math.min(
					Math.max(0, pointerMoveEvent.clientY - yDiff),
					innerHeight - popoverRect.height,
				);

				Object.assign(popover.style, {
					top: "",
					left: "",
					transform: `translate(${numX}px, ${numY}px)`,
				});
			},
			{ signal },
		);

		currentTarget.addEventListener(
			"pointerup",
			() => {
				currentTarget.releasePointerCapture(pointerId);
				controller.abort();
			},
			{ once: true },
		);
	};

	const debounce = createDebounce();

	const emitFindAction = (action: FindReplaceActionType) => {
		findModel.validate();

		if (findModel.state().hasError) {
			return;
		}

		toolbarButtonsActionManager.emitNonCategorizedOperationChange({
			type: toolbarButtonsName.findReplace,
			action,
			navigateTo: 0,
			findText: findModel.value(),
			replaceText: replaceModel.value(),
			matchCase: matchCaseModel.checked(),
			wholeWord: wholeWordModel.checked(),
			useRegex: useRegexModel.checked(),
			includeNonEditableContent: includeNonEditableContentModel.checked(),
		});
	};

	const findPreviousMatch = () => {
		emitFindAction("previous");
	};

	const findNextMatch = () => {
		emitFindAction("next");
	};

	findModel.onValueChange("add", () => {
		setIsFindLoading(true);

		debounce(() => {
			emitFindAction("search-change");

			setIsFindLoading(false);
		}, 250);
	});

	matchCaseModel.onCheckedChange("add", () => {
		emitFindAction("search-change");
	});

	wholeWordModel.onCheckedChange("add", () => {
		emitFindAction("search-change");
	});

	useRegexModel.onCheckedChange("add", () => {
		emitFindAction("search-change");
	});

	includeNonEditableContentModel.onCheckedChange("add", () => {
		emitFindAction("search-change");
	});

	const navigateToIndex = (index: number) => {
		toolbarButtonsActionManager.emitNonCategorizedOperationChange({
			type: toolbarButtonsName.findReplace,
			action: "navigate-to-index",
			navigateTo: index,
			findText: findModel.value(),
			replaceText: replaceModel.value(),
			matchCase: matchCaseModel.checked(),
			wholeWord: wholeWordModel.checked(),
			useRegex: useRegexModel.checked(),
			includeNonEditableContent: includeNonEditableContentModel.checked(),
		});
	};

	const replaceText = () => {
		emitFindAction("replace");
	};

	const replaceAllText = () => {
		emitFindAction("replace-all");
	};

	const checkboxFilterList: CheckboxFilterList = [
		[
			{ controls: matchCaseControls, text: "Match case" },
			{ controls: wholeWordControls, text: "Whole word" },
			{ controls: useRegexControls, text: "Use regex" },
		],
		[
			{
				controls: includeNonEditableContentControls,
				text: "Include non-editable content",
			},
		],
	];

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				commandfor={popoverId}
				command="toggle-popover"
			>
				<Icon name="FindReplace" class="size-4" />
			</ToolbarButton>
			<div
				id={popoverId}
				popover="manual"
				class="max-h-dvh w-full max-w-80 rounded-lg border border-neutral-200 p-2 shadow-md"
				on:toggle={onPopoverToggle}
				on:beforetoggle={setPopoverInitialPosition}
			>
				<div
					class="mb-2 flex cursor-grab items-center justify-between"
					on:pointerdown={movePopover}
				>
					<h2 class="font-bold text-neutral-700 text-sm">Find & Replace</h2>
					<button
						type="button"
						commandfor={popoverId}
						on:pointerdown={(e) => {
							e.stopPropagation();
						}}
						command="hide-popover"
						class="p-1 text-neutral-700 hover:text-neutral-900"
					>
						<Icon name="X" class="size-3" />
					</button>
				</div>
				<div class="mb-3 h-0.5 rounded-sm bg-neutral-300" />
				<div>
					<div
						class="mb-3 space-y-2"
						style={{
							"anchor-scope": findInputAnchorName,
						}}
					>
						<div class="flex items-center justify-between">
							<FormField
								for={findModel.id}
								class="max-w-48 grow"
								style={{
									"anchor-name": findInputAnchorName,
								}}
							>
								<TextFieldWrapper
									appearance="neutral-filled-underline"
									size="medium"
									postfix={<Icon name="MagnifyingGlass" class="size-3" />}
								>
									<InputTextField
										type="text"
										placeholder="Find..."
										class="font-mono"
										on:focus={() => setHasFindFocus(true)}
										on:blur={() => setHasFindFocus(false)}
										spellcheck={false}
										{...findControls}
									/>
								</TextFieldWrapper>
							</FormField>
							<div
								role="alert"
								class="absolute w-[anchor-size(width)] border border-red-400 bg-red-700 p-1 font-medium text-neutral-50 text-xs [position-area:center_bottom]"
								classList={{
									"pointer-events-none invisible": !(
										findModel.state().showError && hasFindFocus()
									),
								}}
								style={{
									"position-anchor": findInputAnchorName,
								}}
							>
								{findModel.state().message}
							</div>
							<Show
								when={!isFindLoading()}
								fallback={
									<Spinning
										class="size-4"
										blueprintColor="var(--color-neutral-300)"
										loadingColor="var(--color-primary-500)"
										strokeWidth={3}
									/>
								}
							>
								<span class="font-semibold text-neutral-600 text-xs">
									{displayIndex()} of {totalResults()}
								</span>
							</Show>
							<span class="inline-flex gap-1.5">
								<button
									type="button"
									class="btn-neutral-solid inline-flex size-6 items-center justify-center rounded-sm"
									on:click={() => findPreviousMatch()}
								>
									<Icon name="ArrowLeft" class="size-3" />
								</button>
								<button
									type="button"
									class="btn-neutral-solid inline-flex size-6 items-center justify-center rounded-sm"
									on:click={() => findNextMatch()}
								>
									<Icon name="ArrowRight" class="size-3" />
								</button>
							</span>
						</div>
						<div>
							<FormField for={replaceModel.id} class="max-w-48 grow">
								<TextFieldWrapper
									appearance="neutral-filled-underline"
									size="medium"
									postfix={<Icon name="Swap" class="size-3" />}
								>
									<InputTextField
										type="text"
										placeholder="Replace..."
										class="font-mono"
										spellcheck={false}
										{...replaceControls}
									/>
								</TextFieldWrapper>
							</FormField>
						</div>
					</div>
					<div class="mb-3 space-y-4">
						<Index each={checkboxFilterList}>
							{(group) => (
								<div class="flex flex-col items-start gap-2">
									<Index each={group()}>
										{(item) => (
											<label class="inline-flex cursor-pointer items-center gap-2">
												<Checkbox {...item().controls} />
												<span class="font-medium text-neutral-600 text-sm">
													{item().text}
												</span>
											</label>
										)}
									</Index>
								</div>
							)}
						</Index>
					</div>
					<FindReplaceResults
						currentIndex={currentIndex}
						results={results}
						onClick={(index) => navigateToIndex(index)}
					/>
					<div class="flex justify-end gap-3">
						<button
							type="button"
							class="btn-primary-solid rounded-sm px-3 py-1 font-medium text-sm"
							on:click={() => replaceText()}
							disabled={replaceDisabled()}
						>
							Replace
						</button>
						<button
							type="button"
							class="btn-primary-outline rounded-sm px-3 py-1 text-sm"
							on:click={() => replaceAllText()}
							disabled={replaceDisabled()}
						>
							Replace All
						</button>
					</div>
				</div>
			</div>
		</span>
	);
};
