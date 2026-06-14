import {
	type Accessor,
	createSignal,
	createUniqueId,
	mergeProps,
	type Setter,
} from "solid-js";
import type {
	CheckboxControls,
	CheckboxErrorRestriction,
	CheckboxHandler,
	CheckboxState,
	CheckedChangeListeners,
} from "./_Utilities";

type OnCheckedChangeFn = (
	operation: "add" | "delete",
	callback: () => void,
) => void;

export interface CheckboxModel extends CheckboxHandler {
	id: string;
	checked: Accessor<boolean>;
	setChecked: Setter<boolean>;
	state: () => CheckboxState;
	onCheckedChange: OnCheckedChangeFn;
}

export interface CreateCheckboxControllerParams {
	defaultValue?: boolean;
	error?: CheckboxErrorRestriction;
	validateOnChange?: boolean;
}

export type CreateCheckboxControllerResult = [CheckboxModel, CheckboxControls];

export const createCheckboxController = (
	props: CreateCheckboxControllerParams,
): CreateCheckboxControllerResult => {
	const finalProps = mergeProps(
		{ defaultValue: false, error: {}, validateOnChange: false },
		props,
	);

	const id = createUniqueId();
	const [checked, setChecked] = createSignal(finalProps.defaultValue);
	const [state, setState] = createSignal<CheckboxState>({
		showError: false,
		hasError: false,
		message: null,
	});
	const [textFieldHandler, setCheckboxHandler] =
		createSignal<CheckboxHandler>();

	const onStateChange = (state: CheckboxState) => {
		setState(state);
	};

	const checkedChangeListeners: CheckedChangeListeners = new Set();

	const onCheckedChange: OnCheckedChangeFn = (operation, callback) => {
		checkedChangeListeners[operation](callback);
	};

	const checkboxModel: CheckboxModel = {
		id,
		checked,
		setChecked,
		state,
		get checkbox() {
			const handler = textFieldHandler();

			if (!handler) {
				throw new Error("Handle can't be undefined.");
			}

			return handler.checkbox;
		},
		onCheckedChange,
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

	const checkboxControls: CheckboxControls = {
		fieldChecked: [checked, setChecked],
		checkedChangeListeners,
		setCheckboxHandler,
		error: props.error ?? {},
		onStateChange,
		validateOnChange: finalProps.validateOnChange,
	};

	return [checkboxModel, checkboxControls];
};
