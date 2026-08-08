import { onCleanup, onMount } from "solid-js";
import type { TemplateVariableUIPort } from "#adapters";
import {
	createTextFieldState,
	FormField,
	InputTextField,
	shouldShowError,
	TextFieldWrapper,
} from "../../../../InputFields";
import { FixedPosModal } from "../../../_Utilities";
import { normalizeTemplateVariableValue } from "./_Utilities";

interface NameModalProps {
	modalId: string;
	uiPort: TemplateVariableUIPort;
}

export const NameModal = (props: NameModalProps) => {
	const [firstNameHandle, firstNameControls] =
		createTextFieldState<HTMLInputElement>({});
	const [lastNameHandle, lastNameControls] =
		createTextFieldState<HTMLInputElement>({});

	onMount(() => {
		const unsubscribe = props.uiPort.onToolbarButtonUpdate((state) => {
			firstNameHandle.setValue(state.options.firstName ?? "");
			lastNameHandle.setValue(state.options.lastName ?? "");
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
		firstNameHandle.setValue(options.firstName ?? "");
		lastNameHandle.setValue(options.lastName ?? "");
	};

	const updateTemplateVariable = () => {
		const firstName = normalizeTemplateVariableValue(firstNameHandle.value());
		const lastName = normalizeTemplateVariableValue(lastNameHandle.value());

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
				for={firstNameHandle.id}
				label="First name"
				showError={shouldShowError(firstNameHandle.state())}
				errorMessage={firstNameHandle.state().message}
			>
				<TextFieldWrapper appearance="primary-outline" size="medium">
					<InputTextField
						type="text"
						placeholder="John"
						spellcheck={false}
						{...firstNameControls}
						on:keydown={handleKeyDown}
					/>
				</TextFieldWrapper>
			</FormField>

			<FormField
				class="mb-4"
				for={lastNameHandle.id}
				label="Last name"
				showError={shouldShowError(lastNameHandle.state())}
				errorMessage={lastNameHandle.state().message}
			>
				<TextFieldWrapper appearance="primary-outline" size="medium">
					<InputTextField
						type="text"
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
