import {
	type Accessor,
	createSignal,
	createUniqueId,
	mergeProps,
	type Setter,
} from "solid-js";
import type {
	HTMLTextFieldElement,
	TextFieldControls,
	TextFieldErrorRestriction,
	TextFieldHandler,
	TextFieldState,
	ValueChangeListeners,
} from "./_Utilities";

type OnValueChangeFn = (
	operation: "add" | "delete",
	callback: () => void,
) => void;

export interface TextFieldModel<TextField extends HTMLTextFieldElement>
	extends TextFieldHandler<TextField> {
	id: string;
	value: Accessor<string>;
	setValue: Setter<string>;
	state: () => TextFieldState;
	onValueChange: OnValueChangeFn;
}

export interface CreateTextFieldControllerParams {
	defaultValue?: string;
	error?: TextFieldErrorRestriction;
	validateOnChange?: boolean;
	onValueChange?: (value: string) => void;
}

export type CreateTextFieldControllerResult<
	TextField extends HTMLTextFieldElement,
> = [TextFieldModel<TextField>, TextFieldControls<TextField>];

export const createTextFieldController = <
	TextField extends HTMLTextFieldElement,
>(
	props: CreateTextFieldControllerParams,
): CreateTextFieldControllerResult<TextField> => {
	const finalProps = mergeProps(
		{ defaultValue: "", error: {}, validateOnChange: false },
		props,
	);

	const id = createUniqueId();
	const [value, setValue] = createSignal(finalProps.defaultValue);
	const [state, setState] = createSignal<TextFieldState>({
		showError: false,
		hasError: false,
		message: null,
	});
	const [textFieldHandler, setTextFieldHandler] =
		createSignal<TextFieldHandler<TextField>>();

	const onStateChange = (state: TextFieldState) => {
		setState(state);
	};

	const valueChangeListeners: ValueChangeListeners = new Set();

	const onValueChange: OnValueChangeFn = (operation, callback) => {
		valueChangeListeners[operation](callback);
	};

	const textFieldModel: TextFieldModel<TextField> = {
		id,
		value,
		setValue,
		state,
		get textField() {
			const handler = textFieldHandler();

			if (!handler) {
				throw new Error("Handle can't be undefined.");
			}

			return handler.textField;
		},
		onValueChange,
		validate: () => {
			const handler = textFieldHandler();

			if (!handler) {
				throw new Error("Handle can't be undefined.");
			}

			handler.validate();
		},
		reset: () => {
			const handler = textFieldHandler();

			if (!handler) {
				throw new Error("Handle can't be undefined.");
			}

			handler.reset();
		},
		checkValidity: () => {
			const handler = textFieldHandler();

			if (!handler) {
				throw new Error("Handle can't be undefined.");
			}

			return handler.checkValidity();
		},
	};

	const textFieldControls: TextFieldControls<TextField> = {
		fieldValue: [value, setValue],
		valueChangeListeners,
		setTextFieldHandler,
		error: props.error ?? {},
		onStateChange,
		validateOnChange: finalProps.validateOnChange,
	};

	return [textFieldModel, textFieldControls];
};
