import { createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import type { EmbedUIPort } from "#adapters";
import { Icon } from "../../../Icon";
import {
	createTextFieldController,
	FormField,
	InputTextField,
	TextFieldWrapper,
} from "../../../InputFields";

export interface EmbedSwapPopoverProps {
	uiPort: EmbedUIPort;
	popoverRef?: (element: HTMLDivElement) => void;
}

export const EmbedSwapPopover = (props: EmbedSwapPopoverProps) => {
	const popoverId = createUniqueId();

	const [urlModel, urlControls] = createTextFieldController({
		error: { required: { value: true, message: "Field can't be empty." } },
	});

	const [checkState, setCheckState] = createSignal(props.uiPort.swapCheckState);

	const checkErrorMessage = () => {
		const state = checkState();
		return state.status === "error" ? state.message : "";
	};

	onMount(() => {
		const unsubscribe = props.uiPort.onSwapCheckStateUpdate(setCheckState);

		onCleanup(() => {
			unsubscribe();
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

		props.uiPort.emitSwap({ url: urlModel.value() });
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
					props.uiPort.swapPopover.setElement(el);
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
