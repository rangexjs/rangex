import { toolbarButtonsName } from "../../../../Constants";
import type { ToolbarButtonsActionManager } from "../../../../ToolbarButtonsActionManager";
import type { NodeInsertionButtonsStateManager } from "../../../../ToolbarButtonsStateManager";
import {
	createTextFieldController,
	FormField,
	InputTextField,
	TextFieldWrapper,
} from "../../../InputFields";
import { FixedPosModal } from "../../_Utilities";
import { normalizeTemplateVariableValue } from "./_Utilities";

interface EmailModalProps {
	modalId: string;
	nodeInsertionButtonStateManager: NodeInsertionButtonsStateManager;
	toolbarButtonsActionManager: ToolbarButtonsActionManager;
}

export const EmailModal = (props: EmailModalProps) => {
	const [emailModel, emailControls] = createTextFieldController({
		error: {
			patterns: [{ value: /.+@.+\..+/, message: "Email's format is invalid." }],
		},
	});

	props.nodeInsertionButtonStateManager.subscribe({
		type: toolbarButtonsName.templateVariable,
		callback: (state) => {
			emailModel.setValue(state.options.email ?? "");
		},
	});

	const updateInitialValue = (event: ToggleEvent) => {
		if (event.newState !== "open") {
			return;
		}

		const { templateVariable } = props.nodeInsertionButtonStateManager;
		emailModel.setValue(templateVariable.options.email ?? "");
	};

	const updateTemplateVariable = (event: MouseEvent) => {
		emailModel.validate();

		if (emailModel.state().hasError) {
			event.preventDefault();
			return;
		}

		const email = normalizeTemplateVariableValue(emailModel.value());

		props.toolbarButtonsActionManager.emitNodeInsertionChange({
			type: toolbarButtonsName.templateVariable,
			action: "update",
			options: { email },
		});
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
