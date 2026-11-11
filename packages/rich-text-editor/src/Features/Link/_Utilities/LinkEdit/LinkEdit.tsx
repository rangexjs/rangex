import type { JSX } from "@solidjs/web";
import {
	FormField,
	InputTextField,
	type TextFieldControls,
	type TextFieldStateHandle,
	TextFieldWrapper,
	ToggleButton,
} from "#ui";

type LinkMode = "insert" | "modify";

interface LinkEditProps {
	mode: LinkMode;
	displayTextHandle: TextFieldStateHandle;
	displayTextControls: TextFieldControls<HTMLInputElement>;
	displayTextDisabled: boolean;
	displayTextPlaceholder: string;
	urlHandle: TextFieldStateHandle;
	urlControls: TextFieldControls<HTMLInputElement>;
	isNewTab: boolean;
	onNewTabChange: () => void;
	onApply: () => void;
	onCancel: () => void;
	class?: JSX.ClassValue;
}

export const LinkEdit = (props: LinkEditProps) => {
	const modeLabel: Record<LinkMode, string> = {
		insert: "Insert",
		modify: "Update",
	};

	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Enter") {
			props.onApply();
		}
	};

	return (
		<div class={props.class}>
			<div class="mb-3 space-y-2">
				<FormField
					class="mb-2"
					for={props.displayTextHandle.id}
					label="Display Text"
					state={props.displayTextHandle.state()}
				>
					<TextFieldWrapper appearance="primary-outline" size="medium">
						<InputTextField
							type="text"
							placeholder={props.displayTextPlaceholder}
							spellcheck={false}
							{...props.displayTextControls}
							disabled={props.displayTextDisabled}
							onKeyDown={onKeyDown}
						/>
					</TextFieldWrapper>
				</FormField>

				<FormField
					class="mb-2"
					for={props.urlHandle.id}
					label="URL"
					state={props.urlHandle.state()}
				>
					<TextFieldWrapper appearance="primary-outline" size="medium">
						<InputTextField
							type="text"
							placeholder="https://example.com"
							spellcheck={false}
							{...props.urlControls}
							onKeyDown={onKeyDown}
						/>
					</TextFieldWrapper>
				</FormField>
			</div>

			<div class="mb-4 space-y-2">
				<div class="flex justify-between">
					<span class="font-medium text-neutral-600 text-sm dark:text-neutral-300">
						Open in New Tab
					</span>
					<ToggleButton
						checked={props.isNewTab}
						label="Open in new tab"
						onClick={props.onNewTabChange}
					/>
				</div>
			</div>

			<div class="flex justify-end gap-2">
				<button
					type="button"
					class="btn-neutral-solid rounded-sm px-3 py-1 font-medium text-sm"
					onClick={props.onCancel}
				>
					Cancel
				</button>
				<button
					type="button"
					class="btn-primary-solid rounded-sm px-3 py-1 font-medium text-sm"
					onClick={props.onApply}
				>
					{modeLabel[props.mode]}
				</button>
			</div>
		</div>
	);
};
