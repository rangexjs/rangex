import type { ReactiveTemplateVariablePort } from "@rangex/solid";
import {
	createTextFieldState,
	FormField,
	InputTextField,
	TextFieldWrapper,
} from "#ui";
import { FixedPosModal } from "../../../_Utilities";
import { normalizeTemplateVariableValue } from "./_Utilities";

interface NameModalProps {
	modalId: string;
	templateVariable: ReactiveTemplateVariablePort;
}

export const NameModal = (props: NameModalProps) => {
	const [firstNameHandle, firstNameControls] =
		createTextFieldState<HTMLInputElement>({});
	const [lastNameHandle, lastNameControls] =
		createTextFieldState<HTMLInputElement>({});

	const onToggle = (event: ToggleEvent) => {
		if (event.newState !== "open") {
			return;
		}

		const options = props.templateVariable.options();
		firstNameHandle.setValue(options.firstName ?? "");
		lastNameHandle.setValue(options.lastName ?? "");
	};

	const updateTemplateVariable = () => {
		const firstName = normalizeTemplateVariableValue(firstNameHandle.value());
		const lastName = normalizeTemplateVariableValue(lastNameHandle.value());

		props.templateVariable.changeOptions({ firstName, lastName });
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
		<FixedPosModal id={props.modalId} title="Name" onToggle={onToggle}>
			<FormField
				class="mb-2"
				for={firstNameHandle.id}
				label="First name"
				state={firstNameHandle.state()}
			>
				<TextFieldWrapper appearance="primary-outline" size="medium">
					<InputTextField
						type="text"
						placeholder="John"
						spellcheck={false}
						{...firstNameControls}
						onKeyDown={handleKeyDown}
					/>
				</TextFieldWrapper>
			</FormField>

			<FormField
				class="mb-4"
				for={lastNameHandle.id}
				label="Last name"
				state={lastNameHandle.state()}
			>
				<TextFieldWrapper appearance="primary-outline" size="medium">
					<InputTextField
						type="text"
						placeholder="Doe"
						spellcheck={false}
						{...lastNameControls}
						onKeyDown={handleKeyDown}
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
					onClick={updateTemplateVariable}
				>
					Update
				</button>
			</div>
		</FixedPosModal>
	);
};
