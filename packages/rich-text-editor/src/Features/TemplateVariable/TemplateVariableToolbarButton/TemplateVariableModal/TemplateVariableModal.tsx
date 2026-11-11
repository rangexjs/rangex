import type {
	TemplateVariableFields,
	TemplateVariablePublicPort,
} from "@rangex/editor/template-variable";
import { flush } from "solid-js";

import type { TemplateVariableModalSettings } from "#context";
import { createTextFieldState, FormField, InputTextField, TextFieldWrapper } from "#ui";

import { FixedPosModal } from "../../../_Utilities";

interface TemplateVariableModalProps {
	modalId: string;
	templateVariable: TemplateVariablePublicPort;
	settings: TemplateVariableModalSettings;
}

export const TemplateVariableModal = (props: TemplateVariableModalProps) => {
	const inputs = props.settings.inputs.map((input) => {
		const [handle, controls] = createTextFieldState<HTMLInputElement>({
			error: {
				patterns: input.patterns,
				custom: {
					// An empty input is valid: the consumer's onUpdate falls back to the placeholder
					isValid: (value) => {
						if (value === "") {
							return true;
						}

						const mismatch = props.templateVariable.validateFieldValue(value);

						return !mismatch;
					},
					message: "Value is too long.",
				},
			},
		});

		return { input, handle, controls };
	});

	const onToggle = (event: ToggleEvent) => {
		if (event.newState !== "open") {
			return;
		}

		const { fields, fieldsConfig } = props.templateVariable;

		// Declared fields without a stored value (e.g. an empty placeholder) are passed as empty strings
		const completeFields: TemplateVariableFields = { ...fields };

		for (const name of Object.keys(fieldsConfig)) {
			if (Object.hasOwn(completeFields, name)) {
				continue;
			}

			completeFields[name] = "";
		}

		for (const { input, handle } of inputs) {
			const value = input.readFields(completeFields, fieldsConfig);

			handle.setValue(value);
		}
	};

	const updateTemplateVariable = (event: MouseEvent) => {
		for (const { handle } of inputs) {
			handle.validate();
		}

		flush();

		const hasError = inputs.some(({ handle }) => handle.state().hasError);

		if (hasError) {
			event.preventDefault();
			return;
		}

		const inputValues = inputs.map(({ handle }) => handle.value());

		const updatedFields = props.settings.onUpdate(inputValues, props.templateVariable.fieldsConfig);

		const fields: TemplateVariableFields = {};

		for (const [name, value] of Object.entries(updatedFields)) {
			if (value === undefined) {
				continue;
			}

			fields[name] = value;
		}

		props.templateVariable.changeFields(fields);
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
		<FixedPosModal id={props.modalId} title={props.settings.title} onToggle={onToggle}>
			{inputs.map(({ input, handle, controls }, index) => (
				<FormField
					class={index === inputs.length - 1 ? "mb-4" : "mb-2"}
					for={handle.id}
					label={input.label}
					state={handle.state()}
				>
					<TextFieldWrapper appearance="primary-outline" size="medium">
						<InputTextField
							type="text"
							placeholder={input.placeholder}
							spellcheck={false}
							{...controls}
							onKeyDown={handleKeyDown}
						/>
					</TextFieldWrapper>
				</FormField>
			))}

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
