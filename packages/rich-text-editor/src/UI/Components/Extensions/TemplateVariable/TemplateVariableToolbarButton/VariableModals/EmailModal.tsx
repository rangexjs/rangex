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

interface EmailModalProps {
	modalId: string;
	uiPort: TemplateVariableUIPort;
}

export const EmailModal = (props: EmailModalProps) => {
	const [emailModel, emailControls] = createTextFieldController({
		error: {
			patterns: [{ value: /.+@.+\..+/, message: "Email's format is invalid." }],
		},
	});

	onMount(() => {
		const unsubscribe = props.uiPort.onToolbarButtonUpdate((state) => {
			emailModel.setValue(state.options.email ?? "");
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const updateInitialValue = (event: ToggleEvent) => {
		if (event.newState !== "open") {
			return;
		}

		emailModel.setValue(props.uiPort.toolbarButton.options.email ?? "");
	};

	const updateTemplateVariable = (event: MouseEvent) => {
		emailModel.validate();

		if (emailModel.state().hasError) {
			event.preventDefault();
			return;
		}

		const email = normalizeTemplateVariableValue(emailModel.value());

		props.uiPort.emitUpdateRequest({ options: { email } });
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
			title="Email"
			on:toggle={updateInitialValue}
		>
			<FormField
				class="mb-4"
				for={emailModel.id}
				label="Email"
				showError={emailModel.state().showError}
				errorMessage={emailModel.state().message}
			>
				<TextFieldWrapper appearance="primary-outline" size="medium">
					<InputTextField
						type="text"
						id={emailModel.id}
						placeholder="name@mail.com"
						spellcheck={false}
						{...emailControls}
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
