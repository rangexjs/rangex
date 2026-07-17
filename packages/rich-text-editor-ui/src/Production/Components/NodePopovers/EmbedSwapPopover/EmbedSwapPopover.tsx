import { createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import type { EmbedSwapCheckState } from "../../../PopoverControllers";
import { usePopoverControllersContext } from "../../App";
import {
	createTextFieldController,
	FormField,
	InputTextField,
	TextFieldWrapper,
} from "../../InputFields";

export const EmbedSwapPopover = () => {
	const { embedSwapPopoverController: controller } =
		usePopoverControllersContext();

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
		onCleanup(controller.onCheckStateChange(setCheckState));
	});

	const onToggle = (event: ToggleEvent) => {
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

		controller.emitSwap({ url: urlModel.value() });
	};

	let updateButtonRef: HTMLButtonElement | undefined;

	const handleKeyDown = (event: KeyboardEvent) => {
		if (!updateButtonRef) {
			throw new Error("UpdateButtonRef can't be undefined.");
		}

		if (event.key !== "Enter") {
			return;
		}

		updateButtonRef.click();
	};

	return (
		<div
			ref={(el) => controller.setPopover(el)}
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
							on:keydown={handleKeyDown}
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
	);
};
