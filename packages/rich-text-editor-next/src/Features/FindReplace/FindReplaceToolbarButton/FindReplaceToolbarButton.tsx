import {
	createEffect,
	createMemo,
	createSignal,
	createUniqueId,
	For,
	Show,
} from "solid-js";
import { useReactiveEditorContext } from "#context";
import {
	Checkbox,
	type CheckboxControls,
	createCheckboxState,
	createTextFieldState,
	FormField,
	Icon,
	InputTextField,
	Spinning,
	showInputFieldError,
	TextFieldWrapper,
} from "#ui";
import { ToolbarButton } from "../../_Utilities";
import { buildFindReplacePattern, createDebounce } from "./_Utilities";
import { FindReplaceResults } from "./FindReplaceResults";

type CheckboxFilterList = { controls: CheckboxControls; text: string }[][];

export const FindReplaceToolbarButton = () => {
	const { findReplace, readOnly } = useReactiveEditorContext();

	if (!findReplace) {
		throw new Error("FindReplace can't be undefined.");
	}

	const [checked, setChecked] = createSignal(false);
	const [isFindLoading, setIsFindLoading] = createSignal(false);

	const currentIndex = () => findReplace.results().currentIndex;
	const totalResults = () => findReplace.results().totalResults;
	const results = () => findReplace.results().results;

	const displayIndex = createMemo(() =>
		totalResults() > 0 ? currentIndex() + 1 : 0,
	);

	const popoverId = createUniqueId();

	const [useRegexHandle, useRegexControls] = createCheckboxState({});
	const [matchCaseHandle, matchCaseControls] = createCheckboxState({});
	const [wholeWordHandle, wholeWordControls] = createCheckboxState({});

	const getPattern = (findText: string) =>
		buildFindReplacePattern({
			findText,
			matchCase: matchCaseHandle.checked(),
			useRegex: useRegexHandle.checked(),
			wholeWord: wholeWordHandle.checked(),
		});

	const isValidPattern = (value: string) => {
		try {
			const { source, flags } = getPattern(value);

			new RegExp(source, flags);

			return true;
		} catch {
			return false;
		}
	};

	/** Falls back to an empty search so an invalid regex clears highlights instead of crashing the engine. */
	const getSafePattern = () => {
		findHandle.validate();

		const findText = isValidPattern(findHandle.value())
			? findHandle.value()
			: "";

		return getPattern(findText);
	};

	const [findHandle, findControls] = createTextFieldState<HTMLInputElement>({
		error: {
			custom: {
				isValid: (value) => isValidPattern(value),
				message: "Invalid regular expression.",
			},
		},
		validateOn: ["blur:changed", "input:dirty"],
	});
	const [replaceHandle, replaceControls] =
		createTextFieldState<HTMLInputElement>({});
	const [includeNonEditableContentHandle, includeNonEditableContentControls] =
		createCheckboxState({});
	const [hasFindFocus, setHasFindFocus] = createSignal(false);
	const [replaceButtonDisabled, setReplaceButtonDisabled] = createSignal(false);
	const [isFirstOpening, setIsFirstOpening] = createSignal(true);

	createEffect(
		() => totalResults() === 0 || showInputFieldError(findHandle.state()),
		(disabled) => {
			setReplaceButtonDisabled(disabled);
		},
	);

	const replaceDisabled = createMemo(
		() => replaceButtonDisabled() || !!readOnly?.checked(),
	);

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
			translate: "-50% -50%",
		});
	};

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState, currentTarget } = event;

		setChecked(newState === "open");

		const pattern = getSafePattern();
		const criteria = {
			pattern,
			includeNonEditableContent: includeNonEditableContentHandle.checked(),
		};

		if (newState === "open") {
			findReplace.open(criteria);
		} else {
			findReplace.close();
		}

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
			translate: "-50% -50%",
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
					translate: `${numX}px ${numY}px`,
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

	const emitSearchChange = () => {
		const pattern = getSafePattern();

		findReplace.search({
			pattern,
			includeNonEditableContent: includeNonEditableContentHandle.checked(),
		});
	};

	const findPreviousMatch = () => {
		findReplace.stepBack();
	};

	const findNextMatch = () => {
		findReplace.stepForward();
	};

	createEffect(
		findHandle.value,
		() => {
			setIsFindLoading(true);

			debounce(() => {
				emitSearchChange();

				setIsFindLoading(false);
			}, 250);
		},
		{ defer: true },
	);

	createEffect(matchCaseHandle.checked, () => emitSearchChange(), {
		defer: true,
	});

	createEffect(wholeWordHandle.checked, () => emitSearchChange(), {
		defer: true,
	});

	createEffect(useRegexHandle.checked, () => emitSearchChange(), {
		defer: true,
	});

	createEffect(
		includeNonEditableContentHandle.checked,
		() => emitSearchChange(),
		{ defer: true },
	);

	const navigateToIndex = (index: number) => {
		findReplace.navigateToIndex({ index });
	};

	const replaceText = () => {
		findReplace.replace({ replaceText: replaceHandle.value() });
	};

	const replaceAllText = () => {
		findReplace.replaceAll({ replaceText: replaceHandle.value() });
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
				class="max-h-dvh w-full max-w-80 rounded-lg border border-neutral-200 bg-white p-2 shadow-md dark:border-neutral-700 dark:bg-neutral-900"
				onToggle={onPopoverToggle}
				onBeforeToggle={setPopoverInitialPosition}
			>
				<div
					class="mb-2 flex cursor-grab items-center justify-between"
					onPointerDown={movePopover}
				>
					<h2 class="font-bold text-neutral-700 text-sm dark:text-neutral-200">
						Find & Replace
					</h2>
					<button
						type="button"
						commandfor={popoverId}
						onPointerDown={(event) => {
							event.stopPropagation();
						}}
						command="hide-popover"
						class="p-1 text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white"
					>
						<Icon name="X" class="size-3" />
					</button>
				</div>
				<div class="mb-3 h-0.5 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
				<div>
					<div
						class="mb-3 space-y-2"
						style={{
							"anchor-scope": findInputAnchorName,
						}}
					>
						<div class="flex items-center justify-between">
							<FormField
								for={findHandle.id}
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
										autocomplete="off"
										class="font-mono"
										onFocus={() => setHasFindFocus(true)}
										onBlur={() => setHasFindFocus(false)}
										spellcheck={false}
										{...findControls}
									/>
								</TextFieldWrapper>
							</FormField>
							<div
								role="alert"
								class="absolute w-[anchor-size(width)] bg-red-700 p-1 font-medium text-neutral-50 text-xs [position-area:center_bottom] dark:bg-red-800 dark:text-neutral-300"
								hidden={
									!(showInputFieldError(findHandle.state()) && hasFindFocus())
								}
								style={{
									"position-anchor": findInputAnchorName,
								}}
							>
								{findHandle.state().message}
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
								<span class="font-semibold text-neutral-600 text-xs dark:text-neutral-400">
									{displayIndex()} of {totalResults()}
								</span>
							</Show>
							<span class="inline-flex gap-1.5">
								<button
									type="button"
									class="btn-neutral-solid inline-flex size-6 items-center justify-center rounded-sm"
									onClick={() => findPreviousMatch()}
								>
									<Icon name="ArrowLeft" class="size-3" />
								</button>
								<button
									type="button"
									class="btn-neutral-solid inline-flex size-6 items-center justify-center rounded-sm"
									onClick={() => findNextMatch()}
								>
									<Icon name="ArrowRight" class="size-3" />
								</button>
							</span>
						</div>
						<div>
							<FormField for={replaceHandle.id} class="max-w-48 grow">
								<TextFieldWrapper
									appearance="neutral-filled-underline"
									size="medium"
									postfix={<Icon name="Swap" class="size-3" />}
								>
									<InputTextField
										type="text"
										placeholder="Replace..."
										autocomplete="off"
										class="font-mono"
										spellcheck={false}
										{...replaceControls}
									/>
								</TextFieldWrapper>
							</FormField>
						</div>
					</div>
					<div class="mb-3 space-y-4">
						<For each={checkboxFilterList} keyed={false}>
							{(group) => (
								<div class="flex flex-col items-start gap-2">
									<For each={group()} keyed={false}>
										{(item) => (
											<label class="inline-flex cursor-pointer items-center gap-2">
												<Checkbox {...item().controls} />
												<span class="font-medium text-neutral-600 text-sm dark:text-neutral-300">
													{item().text}
												</span>
											</label>
										)}
									</For>
								</div>
							)}
						</For>
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
							onClick={() => replaceText()}
							disabled={replaceDisabled()}
						>
							Replace
						</button>
						<button
							type="button"
							class="btn-primary-outline rounded-sm px-3 py-1 font-medium text-sm"
							onClick={() => replaceAllText()}
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
