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

interface DateModalProps {
	modalId: string;
	nodeInsertionButtonStateManager: NodeInsertionButtonsStateManager;
	toolbarButtonsActionManager: ToolbarButtonsActionManager;
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

	props.nodeInsertionButtonStateManager.subscribe({
		type: toolbarButtonsName.templateVariable,
		callback: (state) => {
			dateModel.setValue(state.options.date ?? "");
		},
	});

	const updateInitialValue = (event: ToggleEvent) => {
		if (event.newState !== "open") {
			return;
		}

		const { templateVariable } = props.nodeInsertionButtonStateManager;
		dateModel.setValue(templateVariable.options.date ?? "");
	};

	const updateTemplateVariable = (event: MouseEvent) => {
		dateModel.validate();

		if (dateModel.state().hasError) {
			event.preventDefault();
			return;
		}

		props.toolbarButtonsActionManager.emitNodeInsertionChange({
			type: toolbarButtonsName.templateVariable,
			action: "update",
			options: {
				date: dateModel.value(),
			},
		});
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
					/>
				</TextFieldWrapper>
			</FormField>

			<div class="text-right">
				<button
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
