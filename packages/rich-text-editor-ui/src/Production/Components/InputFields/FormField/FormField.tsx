import { createMemo, type JSX, Show } from "solid-js";
import { Icon } from "../../Icon";

interface FormFieldProps {
	for?: string;
	label?: JSX.Element;
	description?: JSX.Element;
	showError?: boolean;
	errorMessage?: JSX.Element;
	class?: string;
	style?: JSX.CSSProperties;
	labelClass?: string;
	infoClass?: string;
	descriptionClass?: string;
	errorClass?: string;
	children: JSX.Element;
}

export const FormField = (props: FormFieldProps) => {
	const isInfoContainerVisible = createMemo(
		() =>
			!!(
				(props.showError && props.errorMessage) ||
				(!props.showError && props.description)
			),
	);

	return (
		<div class={`grid content-start gap-0 ${props.class}`} style={props.style}>
			<label
				for={props.for}
				class={`ml-0.5 justify-self-start font-semibold text-neutral-800 text-xs`}
				classList={{ "mb-2": !!props.label, [props.labelClass ?? ""]: true }}
			>
				{props.label}
			</label>
			{props.children}
			<div
				class={`ml-0.5 font-semibold text-neutral-700 text-xs`}
				classList={{
					"mt-1": isInfoContainerVisible(),
					[props.infoClass ?? ""]: true,
				}}
			>
				<p class={props.descriptionClass}>
					<Show when={!props.showError}>{props.description}</Show>
				</p>
				{/* Alert requires the description/errorMessage to be separated */}
				<p role="alert" class={`flex gap-1 text-red-600 ${props.errorClass}`}>
					<Show when={props.showError}>
						<Icon
							name="WarningCircle"
							class="mt-0.5 size-3 shrink-0 align-baseline"
						/>
						<span>{props.errorMessage}</span>
					</Show>
				</p>
			</div>
		</div>
	);
};
