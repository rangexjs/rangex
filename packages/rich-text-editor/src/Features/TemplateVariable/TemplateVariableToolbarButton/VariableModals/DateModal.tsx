import type { TemplateVariablePublicPort } from "@rangex/editor";
import { flush } from "solid-js";
import {
	createTextFieldState,
	FormField,
	InputTextField,
	TextFieldWrapper,
} from "#ui";
import { FixedPosModal } from "../../../_Utilities";
import { normalizeTemplateVariableValue } from "./_Utilities";

interface DateModalProps {
	modalId: string;
	templateVariable: TemplateVariablePublicPort;
}

export const DateModal = (props: DateModalProps) => {
	const [dateHandle, dateControls] = createTextFieldState<HTMLInputElement>({
		error: {
			patterns: [
				{
					value: /\d{4}-\d{2}-\d{2}/,
					message: "Date must be a valid ISO format. (YYYY-MM-DD)",
				},
			],
		},
	});

	const onToggle = (event: ToggleEvent) => {
		if (event.newState !== "open") {
			return;
		}

		dateHandle.setValue(props.templateVariable.options.date ?? "");
	};

	const updateTemplateVariable = (event: MouseEvent) => {
		dateHandle.validate();

		flush();

		if (dateHandle.state().hasError) {
			event.preventDefault();
			return;
		}

		const date = normalizeTemplateVariableValue(dateHandle.value());

		props.templateVariable.changeOptions({ date });
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
		<FixedPosModal id={props.modalId} title="Date" onToggle={onToggle}>
			<FormField
				class="mb-4"
				for={dateHandle.id}
				label="Date"
				state={dateHandle.state()}
			>
				<TextFieldWrapper appearance="primary-outline" size="medium">
					<InputTextField
						type="text"
						placeholder="2012-05-22"
						spellcheck={false}
						{...dateControls}
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
