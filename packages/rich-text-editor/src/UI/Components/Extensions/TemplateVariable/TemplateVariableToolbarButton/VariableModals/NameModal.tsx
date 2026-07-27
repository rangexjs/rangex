import { onCleanup, onMount } from "solid-js";
import type { TemplateVariableUIPort } from "#adapters";
import {
	createTextFieldController,
	FormField,
	InputTextField,
	TextFieldWrapper,
} from "../../../../InputFields";
import { FixedPosModal } from "../../../_Utilities";
import { normalizeTemplateVariableValue } from "./_Utilities";

interface NameModalProps {
	modalId: string;
	uiPort: TemplateVariableUIPort;
}

export const NameModal = (props: NameModalProps) => {
	const [firstNameModel, firstNameControls] = createTextFieldController({});
	const [lastNameModel, lastNameControls] = createTextFieldController({});

	onMount(() => {
		const unsubscribe = props.uiPort.onToolbarButtonUpdate((state) => {
			firstNameModel.setValue(state.options.firstName ?? "");
			lastNameModel.setValue(state.options.lastName ?? "");
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const updateInitialValue = (event: ToggleEvent) => {
		if (event.newState !== "open") {
			return;
		}

		const { options } = props.uiPort.toolbarButton;
		firstNameModel.setValue(options.firstName ?? "");
		lastNameModel.setValue(options.lastName ?? "");
	};

	const updateTemplateVariable = () => {
		const firstName = normalizeTemplateVariableValue(firstNameModel.value());
		const lastName = normalizeTemplateVariableValue(lastNameModel.value());

		props.uiPort.emitUpdateRequest({ options: { firstName, lastName } });
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
			title="Name"
			on:toggle={updateInitialValue}
		>
			<FormField
				class="mb-2"
				for={firstNameModel.id}
				label="First name"
				showError={firstNameModel.state().showError}
				errorMessage={firstNameModel.state().message}
			>
				<TextFieldWrapper appearance="primary-outline" size="medium">
					<InputTextField
						type="text"
						id={firstNameModel.id}
						placeholder="John"
						spellcheck={false}
						{...firstNameControls}
						on:keydown={handleKeyDown}
					/>
				</TextFieldWrapper>
			</FormField>

			<FormField
				class="mb-4"
				for={lastNameModel.id}
				label="Last name"
				showError={lastNameModel.state().showError}
				errorMessage={lastNameModel.state().message}
			>
				<TextFieldWrapper appearance="primary-outline" size="medium">
					<InputTextField
						type="text"
						id={lastNameModel.id}
						placeholder="Doe"
						spellcheck={false}
						{...lastNameControls}
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
