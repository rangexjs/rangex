import { createSignal, createUniqueId, merge, onSettled } from "solid-js";

import { showInputFieldError } from "../_Utilities";
import {
  getErrorState,
  type HTMLTextFieldElement,
  type TextFieldControls,
  type TextFieldErrorRestriction,
  type TextFieldHandle,
  type TextFieldState,
} from "./_Utilities";

export type ValidationOption = "blur:changed" | "input:dirty";
export type ValidateOn = ValidationOption[];

export interface CreateTextFieldControllerParams {
  defaultValue?: string;
  error?: TextFieldErrorRestriction;
  validateOn?: ValidateOn;
}

export type CreateTextFieldControllerResult<TextField extends HTMLTextFieldElement> = [
  TextFieldHandle,
  TextFieldControls<TextField>,
];

const isTextFieldStateEqual = (prev: TextFieldState, next: TextFieldState) =>
  prev.isDirty === next.isDirty && prev.hasError === next.hasError && prev.message === next.message;

export const createTextFieldController = <TextField extends HTMLTextFieldElement>(
  props: CreateTextFieldControllerParams,
): CreateTextFieldControllerResult<TextField> => {
  const defaultValidateOn: ValidateOn = [];

  const finalProps = merge({ defaultValue: "", error: {}, validateOn: defaultValidateOn }, props);

  const id = createUniqueId();
  let localTextField: TextField | null = null;

  const setTextField = (textField: TextField) => {
    localTextField = textField;
  };

  const getTextField = () => {
    if (!localTextField) {
      throw new Error("Can't access to the TextField before mount.");
    }

    return localTextField;
  };

  let textChangedDuringFocus = false;

  const [value, setLocalValue] = createSignal(finalProps.defaultValue);

  const [state, setLocalState] = createSignal<TextFieldState>(
    {
      isDirty: false,
      ...getErrorState(finalProps.defaultValue, finalProps.error),
    },
    { equals: isTextFieldStateEqual },
  );

  const commitState = (nextState: TextFieldState) => {
    setLocalState(nextState);
    localTextField?.setAttribute("data-invalid", `${showInputFieldError(nextState)}`);
  };

  const commitValidation = (nextValue: string) => {
    const nextState: TextFieldState = {
      isDirty: true,
      ...getErrorState(nextValue, finalProps.error),
    };

    commitState(nextState);

    return nextState;
  };

  const textFieldHandle: TextFieldHandle = {
    get id() {
      return id;
    },

    value,

    setValue(nextValue) {
      const textField = getTextField();

      textField.value = nextValue;
      setLocalValue(nextValue);
    },

    state,

    validate() {
      const nextState = commitValidation(value());

      return nextState;
    },

    reset(nextValue = finalProps.defaultValue) {
      const textField = getTextField();

      textField.value = nextValue;
      setLocalValue(nextValue);

      commitState({
        isDirty: false,
        ...getErrorState(nextValue, finalProps.error),
      });
    },

    checkValidity() {
      const { hasError, message } = getErrorState(value(), finalProps.error);

      return { hasError, message, isDirty: state().isDirty };
    },
  };

  const textFieldControls: TextFieldControls<TextField> = {
    id,
    defaultValue: finalProps.defaultValue,
    setTextField,
  };

  const onFocus = () => {
    textChangedDuringFocus = false;
  };

  const onBlur = () => {
    if (!textChangedDuringFocus) {
      return;
    }

    if (!finalProps.validateOn.includes("blur:changed")) {
      return;
    }

    textFieldHandle.validate();
  };

  const onInput = () => {
    textChangedDuringFocus = true;

    const textField = getTextField();
    const nextValue = textField.value;

    setLocalValue(nextValue);

    const { hasError } = getErrorState(nextValue, finalProps.error);

    // Always revalidate if the previous state had an error, but the current one is valid
    if (showInputFieldError(state()) && !hasError) {
      commitValidation(nextValue);
      return;
    }

    if (!finalProps.validateOn.includes("input:dirty")) {
      return;
    }

    if (!state().isDirty) {
      return;
    }

    commitValidation(nextValue);
  };

  onSettled(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const textField = getTextField();

    textField.addEventListener("focus", onFocus, { signal });

    textField.addEventListener("blur", onBlur, { signal });

    textField.addEventListener("input", onInput, { signal });

    return () => {
      abortController.abort();
    };
  });

  return [textFieldHandle, textFieldControls];
};
