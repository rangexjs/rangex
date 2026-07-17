import { createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import type {
	EmbedPopoverController,
	EmbedSwapCheckState,
	UpdateEmbedSwapCheckStateFn,
} from "../../../PopoverControllers";
import { Icon } from "../../Icon";
import {
	createTextFieldController,
	FormField,
	InputTextField,
	TextFieldWrapper,
} from "../../InputFields";

export interface EmbedSwapPopoverProps {
	controller: EmbedPopoverController;
	popoverRef?: (element: HTMLDivElement) => void;
}

export const EmbedSwapPopover = (props: EmbedSwapPopoverProps) => {
	const popoverId = createUniqueId();

	const [urlModel, urlControls] = createTextFieldController({
		error: { required: { value: true, message: "Field can't be empty." } },
	});

	const [checkState, setCheckState] = createSignal<EmbedSwapCheckState>({
		status: "idle",
	});

	const checkErrorMessage = () => {
		const state = checkState();
		return state.status === "error" ? state.message : "";
	};

	onMount(() => {
		const onSwapCheckState: UpdateEmbedSwapCheckStateFn = (value) =>
			setCheckState(value);

		props.controller.subscribe({
			type: "swapCheckState",
			callback: onSwapCheckState,
		});

		onCleanup(() => {
			props.controller.unsubscribe({
				type: "swapCheckState",
				callback: onSwapCheckState,
			});
		});
	});

	const [isOpen, setIsOpen] = createSignal(false);

	const onToggle = (event: ToggleEvent) => {
		setIsOpen(event.newState === "open");

		if (event.newState !== "closed") {
			return;
		}

		urlModel.reset();
		urlModel.setValue("");
		setCheckState({ status: "idle" });
	};

	const onUpdateClick = (event: MouseEvent) => {
		event.preventDefault();

		urlModel.validate();

		if (urlModel.checkValidity().hasError) {
			return;
		}

		props.controller.emitSwap({ url: urlModel.value() });
	};

	let updateButtonRef: HTMLButtonElement | undefined;

	const onKeyDown = (event: KeyboardEvent) => {
		if (!updateButtonRef) {
			throw new Error("UpdateButtonRef can't be undefined.");
		}

		if (event.key !== "Enter") {
			return;
		}

		updateButtonRef.click();
	};

	return (
		<span>
			{/*
				Temporary workaround: the default `command="toggle-popover"` open/close is
				intercepted engine-side (see HandleEmbedSwapPopoverToggle) so the popover can
				be re-opened with `showPopover({ source })` instead, since anchor-name/
				position-anchor don't cross shadow trees yet. Remove the interception (and
				this note) once cross-root CSS anchoring is supported.
			*/}
			<button
				type="button"
				commandfor={popoverId}
				command="toggle-popover"
				class="btn-menu-trigger flex items-center justify-center rounded p-1"
				data-is-checked={isOpen()}
				title="Swap"
			>
				<Icon name="Swap" class="size-4" />
			</button>

			<div
				ref={(el) => {
					props.controller.setSwapPopover(el);
					props.popoverRef?.(el);
				}}
				id={popoverId}
				popover="auto"
				class="w-64 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
				on:toggle={onToggle}
			>
				<div class="mb-3">
					<FormField
						for={urlModel.id}
						showError={urlModel.state().showError}
						errorMessage={urlModel.state().message}
					>
						<TextFieldWrapper appearance="primary-outline" size="medium">
							<InputTextField
								type="text"
								id={urlModel.id}
								aria-label="URL"
								placeholder="https://example.com/embed"
								spellcheck={false}
								{...urlControls}
								on:keydown={onKeyDown}
							/>
						</TextFieldWrapper>
					</FormField>
				</div>

				<div
					class="mb-3 text-red-600 text-sm dark:text-red-400"
					hidden={checkState().status !== "error"}
				>
					{checkErrorMessage()}
				</div>

				<div class="text-right">
					<button
						ref={updateButtonRef}
						type="button"
						class="btn-primary-solid rounded-sm px-4 py-1 font-semibold text-sm"
						on:click={onUpdateClick}
					>
						Update
					</button>
				</div>
			</div>
		</span>
	);
};
