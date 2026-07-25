import { onCleanup, onMount } from "solid-js";
import type { TemplateVariableUIPort } from "#adapters";
import {
	createTextFieldController,
	FormField,
	InputTextField,
	TextFieldWrapper,
} from "../../../../InputFields";
import { FixedPosModal } from "../../../../ToolbarButtons/_Utilities";
import { normalizeTemplateVariableValue } from "./_Utilities";

interface DateModalProps {
	modalId: string;
	uiPort: TemplateVariableUIPort;
}

export const DateModal = (props: DateModalProps) => {
	const [dateModel, dateControls] = createTextFieldController({
		error: {
			patterns: [
				{
					value: /\d{4}-\d{2}-\d{2}/,
					message: "Date must be a valid ISO format. (YYYY-MM-DD)",
				},
			],
		},
	});

	onMount(() => {
		const unsubscribe = props.uiPort.onToolbarButtonUpdate((state) => {
			dateModel.setValue(state.options.date ?? "");
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const updateInitialValue = (event: ToggleEvent) => {
		if (event.newState !== "open") {
			return;
		}

		dateModel.setValue(props.uiPort.toolbarButton.options.date ?? "");
	};

	const updateTemplateVariable = (event: MouseEvent) => {
		dateModel.validate();

		if (dateModel.state().hasError) {
			event.preventDefault();
			return;
		}

		const date = normalizeTemplateVariableValue(dateModel.value());

		props.uiPort.emitUpdateRequest({ options: { date } });
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
		<FixedPosModal
			id={props.modalId}
			title="Date"
			on:toggle={updateInitialValue}
		>
			<FormField
				class="mb-4"
				for={dateModel.id}
				label="Date"
				showError={dateModel.state().showError}
				errorMessage={dateModel.state().message}
			>
				<TextFieldWrapper appearance="primary-outline" size="medium">
					<InputTextField
						type="text"
						id={dateModel.id}
						placeholder="2012-05-22"
						spellcheck={false}
						{...dateControls}
						on:keydown={handleKeyDown}
					/>
				</TextFieldWrapper>
			</FormField>

			<div class="text-right">
				<button
					ref={updateButtonRef}
					type="button"
					commandfor={props.modalId}
					command="close"
					class="btn-primary-solid rounded-sm px-4 py-1 font-semibold text-sm"
					on:click={updateTemplateVariable}
				>
					Update
				</button>
			</div>
		</FixedPosModal>
	);
};
