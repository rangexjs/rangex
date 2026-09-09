import type { ReactiveTemplateVariablePort } from "@rangex/solid";
import { flush } from "solid-js";
import {
	createTextFieldState,
	FormField,
	InputTextField,
	TextFieldWrapper,
} from "#ui";
import { FixedPosModal } from "../../../_Utilities";
import { normalizeTemplateVariableValue } from "./_Utilities";

interface EmailModalProps {
	modalId: string;
	templateVariable: ReactiveTemplateVariablePort;
}

export const EmailModal = (props: EmailModalProps) => {
	const [emailHandle, emailControls] = createTextFieldState<HTMLInputElement>({
		error: {
			patterns: [{ value: /.+@.+\..+/, message: "Email's format is invalid." }],
		},
	});

	const onToggle = (event: ToggleEvent) => {
		if (event.newState !== "open") {
			return;
		}

		emailHandle.setValue(props.templateVariable.options().email ?? "");
	};

	const updateTemplateVariable = (event: MouseEvent) => {
		emailHandle.validate();

		flush();

		if (emailHandle.state().hasError) {
			event.preventDefault();
			return;
		}

		const email = normalizeTemplateVariableValue(emailHandle.value());

		props.templateVariable.changeOptions({ email });
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
		<FixedPosModal id={props.modalId} title="Email" onToggle={onToggle}>
			<FormField
				class="mb-4"
				for={emailHandle.id}
				label="Email"
				state={emailHandle.state()}
			>
				<TextFieldWrapper appearance="primary-outline" size="medium">
					<InputTextField
						type="text"
						placeholder="name@mail.com"
						spellcheck={false}
						{...emailControls}
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
