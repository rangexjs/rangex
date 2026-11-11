import type { JSX } from "@solidjs/web";
import { createMemo, Show } from "solid-js";

import { Icon } from "../../Icon";
import { type InputFieldState, showInputFieldError } from "../_Utilities";

interface FormFieldProps {
	for?: string;
	label?: JSX.Element;
	description?: JSX.Element;
	state?: InputFieldState;
	class?: JSX.ClassValue;
	style?: JSX.CSSProperties;
	labelClass?: JSX.ClassValue;
	infoClass?: JSX.ClassValue;
	descriptionClass?: JSX.ClassValue;
	errorClass?: JSX.ClassValue;
	children: JSX.Element;
}

export const FormField = (props: FormFieldProps) => {
	const showError = createMemo(() => !!props.state && showInputFieldError(props.state));

	const isInfoContainerVisible = createMemo(
		() => !!((showError() && props.state?.message) || (!showError() && props.description)),
	);

	return (
		<div class={["grid content-start gap-0", props.class]} style={props.style}>
			<label
				for={props.for}
				class={[
					"ml-0.5 justify-self-start font-semibold text-neutral-800 text-xs dark:text-neutral-200",
					{ "mb-2": !!props.label },
					props.labelClass,
				]}
			>
				{props.label}
			</label>
			{props.children}
			<div
				class={[
					"ml-0.5 font-semibold text-neutral-700 text-xs dark:text-neutral-300",
					{ "mt-1": isInfoContainerVisible() },
					props.infoClass,
				]}
			>
				<p class={props.descriptionClass}>
					<Show when={!showError()}>{props.description}</Show>
				</p>
				{/* Alert requires the description/error message to be separated */}
				<p role="alert" class={["flex gap-1 text-red-600 dark:text-red-700", props.errorClass]}>
					<Show when={showError()}>
						<Icon name="WarningCircle" class="mt-0.5 size-3 shrink-0 align-baseline" />
						<span>{props.state?.message}</span>
					</Show>
				</p>
			</div>
		</div>
	);
};
