import type { LinkApplyParams, LinkMode } from "@rangex/editor";
import type { ReactiveLinkPort } from "@rangex/solid";
import { createEffect, createSignal, flush } from "solid-js";
import {
	createTextFieldState,
	FormField,
	InputTextField,
	TextFieldWrapper,
	ToggleButton,
} from "#ui";
import { allowedPrefixes } from "../_Utilities";

interface LinkEditProps {
	link: ReactiveLinkPort;
}

const modeLabel: Record<LinkMode, string> = {
	insert: "Insert",
	modify: "Update",
};

export const LinkEdit = (props: LinkEditProps) => {
	const [displayTextHandle, displayTextControls] =
		createTextFieldState<HTMLInputElement>({
			defaultValue: props.link.displayText().inputValue,
		});

	const [urlHandle, urlControls] = createTextFieldState<HTMLInputElement>({
		defaultValue: props.link.url().inputValue,
		error: { required: { value: true, message: "Field can't be empty." } },
	});

	const [isNewTab, setIsNewTab] = createSignal(
		props.link.toggleButtons().isNewTab,
	);

	// Re-sync the form fields every time the popover transitions into "edit" — for a fresh
	// insert, for editing the link just clicked, or for re-editing after a cancel.
	createEffect(
		() => props.link.view(),
		(view) => {
			if (view !== "edit") {
				return;
			}

			displayTextHandle.reset();
			displayTextHandle.setValue(props.link.displayText().inputValue);

			urlHandle.reset();
			urlHandle.setValue(props.link.url().inputValue);

			setIsNewTab(props.link.toggleButtons().isNewTab);

			flush();

			document.getElementById(displayTextHandle.id)?.focus();
		},
	);

	const onNewTabChange = () => {
		setIsNewTab((prev) => !prev);
	};

	const onCancel = () => {
		props.link.viewChange("preview");
		props.link.cancel();
	};

	const onApply = () => {
		urlHandle.validate();

		flush();

		if (urlHandle.state().hasError) {
			return;
		}

		const rawUrl = urlHandle.value();
		const normalizedUrl = allowedPrefixes.some((prefix) =>
			rawUrl.startsWith(prefix),
		)
			? rawUrl
			: `https://${rawUrl}`;

		props.link.viewChange("preview");

		const applyParams: LinkApplyParams = {
			text: displayTextHandle.value(),
			url: normalizedUrl,
			isNewTab: isNewTab(),
		};

		if (props.link.mode() === "insert") {
			props.link.insert(applyParams);
			return;
		}

		props.link.modify(applyParams);
	};

	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Enter") {
			onApply();
		}
	};

	return (
		<div hidden={props.link.view() !== "edit"}>
			<div class="mb-3 space-y-2">
				<FormField
					class="mb-2"
					for={displayTextHandle.id}
					label="Display Text"
					state={displayTextHandle.state()}
				>
					<TextFieldWrapper appearance="primary-outline" size="medium">
						<InputTextField
							type="text"
							placeholder="Example"
							spellcheck={false}
							{...displayTextControls}
							disabled={props.link.displayText().disabled}
							onKeyDown={onKeyDown}
						/>
					</TextFieldWrapper>
				</FormField>

				<FormField
					class="mb-2"
					for={urlHandle.id}
					label="URL"
					state={urlHandle.state()}
				>
					<TextFieldWrapper appearance="primary-outline" size="medium">
						<InputTextField
							type="text"
							placeholder="https://example.com"
							spellcheck={false}
							{...urlControls}
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
					<ToggleButton checked={isNewTab()} onClick={onNewTabChange} />
				</div>
			</div>

			<div class="flex justify-end gap-2">
				<button
					type="button"
					class="btn-neutral-solid rounded-sm px-3 py-1 font-medium text-sm"
					onClick={onCancel}
				>
					Cancel
				</button>
				<button
					type="button"
					class="btn-primary-solid rounded-sm px-3 py-1 font-medium text-sm"
					onClick={onApply}
				>
					{modeLabel[props.link.mode()]}
				</button>
			</div>
		</div>
	);
};
