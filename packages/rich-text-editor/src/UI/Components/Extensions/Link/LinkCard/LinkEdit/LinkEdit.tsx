import { createSignal, onCleanup, onMount } from "solid-js";
import type { EmitApplyParams, LinkMode, LinkUIPort } from "#adapters";
import {
	createTextFieldState,
	FormField,
	InputTextField,
	shouldShowError,
	TextFieldWrapper,
} from "../../../../InputFields";
import { ToggleButton } from "../../../../ToggleButton";
import { allowedPrefixes } from "../_Utilities";

interface LinkEditProps {
	uiPort: LinkUIPort;
}

export const LinkEdit = (props: LinkEditProps) => {
	const uiPort = props.uiPort;

	const [currentMode, setCurrentMode] = createSignal(uiPort.mode);

	const [displayTextHandle, displayTextControls] =
		createTextFieldState<HTMLInputElement>({
			defaultValue: uiPort.displayText.inputValue,
		});
	const [displayTextDisabled, setDisplayTextDisabled] = createSignal(
		uiPort.displayText.disabled,
	);

	const [urlHandle, urlControls] = createTextFieldState<HTMLInputElement>({
		defaultValue: uiPort.url.inputValue,
		error: { required: { value: true, message: "Field can't be empty." } },
	});

	const [isNewTab, setIsNewTab] = createSignal(uiPort.toggleButtons.isNewTab);

	const modeLabel: Record<LinkMode, string> = {
		insert: "Insert",
		modify: "Update",
	};

	const emitApply = (mode: LinkMode, params: EmitApplyParams) =>
		({
			insert: () => uiPort.emitInsert(params),
			modify: () => uiPort.emitModify(params),
		})[mode]();

	onMount(() => {
		const unsubscribeView = uiPort.onViewUpdate(() => urlHandle.reset());
		const unsubscribeMode = uiPort.onModeUpdate((value) =>
			setCurrentMode(value),
		);
		const unsubscribeDisplayText = uiPort.onDisplayTextUpdate((state) => {
			displayTextHandle.setValue(state.inputValue);
			setDisplayTextDisabled(state.disabled);
		});
		const unsubscribeUrl = uiPort.onUrlUpdate((state) =>
			urlHandle.setValue(state.inputValue),
		);
		const unsubscribeToggleButtons = uiPort.onToggleButtonsUpdate((state) =>
			setIsNewTab(state.isNewTab),
		);

		onCleanup(() => {
			unsubscribeView();
			unsubscribeMode();
			unsubscribeDisplayText();
			unsubscribeUrl();
			unsubscribeToggleButtons();
		});
	});

	const onNewTabChange = () => {
		setIsNewTab((prev) => !prev);
	};

	const onCancel = () => {
		uiPort.setView("preview");

		uiPort.emitViewChange();
		uiPort.emitCancel();
	};

	const onApply = () => {
		urlHandle.validate();

		if (urlHandle.state().hasError) {
			return;
		}

		const rawUrl = urlHandle.value();
		const normalizedUrl = allowedPrefixes.some((p) => rawUrl.startsWith(p))
			? rawUrl
			: `https://${rawUrl}`;

		uiPort.setView("preview");

		uiPort.emitViewChange();

		const applyParams: EmitApplyParams = {
			text: displayTextHandle.value(),
			url: normalizedUrl,
			isNewTab: isNewTab(),
		};

		emitApply(currentMode(), applyParams);
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			onApply();
		}
	};

	return (
		<div>
			<div class="mb-3 space-y-2">
				<FormField
					class="mb-2"
					for={displayTextHandle.id}
					label="Display Text"
					showError={shouldShowError(displayTextHandle.state())}
					errorMessage={displayTextHandle.state().message}
				>
					<TextFieldWrapper appearance="primary-outline" size="medium">
						<InputTextField
							type="text"
							autofocus={true}
							placeholder="Example"
							spellcheck={false}
							{...displayTextControls}
							disabled={displayTextDisabled()}
							onKeyDown={onKeyDown}
						/>
					</TextFieldWrapper>
				</FormField>

				<FormField
					class="mb-2"
					for={urlHandle.id}
					label="URL"
					showError={shouldShowError(urlHandle.state())}
					errorMessage={urlHandle.state().message}
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
					<ToggleButton checked={isNewTab()} on:click={onNewTabChange} />
				</div>
			</div>

			<div class="flex justify-end gap-2">
				<button
					type="button"
					class="btn-neutral-solid rounded-sm px-3 py-1 font-medium text-sm"
					on:click={onCancel}
				>
					Cancel
				</button>
				<button
					type="button"
					class="btn-primary-solid rounded-sm px-3 py-1 font-medium text-sm"
					on:click={onApply}
				>
					{modeLabel[currentMode()]}
				</button>
			</div>
		</div>
	);
};
