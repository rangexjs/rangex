import { createSignal, onCleanup, onMount } from "solid-js";
import type {
	LinkAdapter,
	LinkUpdateDisplayTextFn,
	LinkUpdateModeFn,
	LinkUpdateToggleButtonsFn,
	LinkUpdateURLFn,
	LinkUpdateViewFn,
} from "#adapters";
import type { EmitApplyParams, LinkMode } from "#ports";
import {
	createTextFieldController,
	FormField,
	InputTextField,
	TextFieldWrapper,
} from "../../../../InputFields";
import { ToggleButton } from "../../../../ToggleButton";
import { allowedPrefixes } from "../_Utilities";

interface LinkEditProps {
	adapter: LinkAdapter;
}

export const LinkEdit = (props: LinkEditProps) => {
	const adapter = props.adapter;

	const [currentMode, setCurrentMode] = createSignal(adapter.mode);

	const [displayTextModel, displayTextControls] = createTextFieldController({
		defaultValue: adapter.displayText.inputValue,
	});
	const [displayTextDisabled, setDisplayTextDisabled] = createSignal(
		adapter.displayText.disabled,
	);

	const [urlModel, urlControls] = createTextFieldController({
		defaultValue: adapter.url.inputValue,
		error: { required: { value: true, message: "Field can't be empty." } },
	});

	const [isNewTab, setIsNewTab] = createSignal(adapter.toggleButtons.isNewTab);

	const modeLabel: Record<LinkMode, string> = {
		insert: "Insert",
		modify: "Update",
	};

	const emitApply = (mode: LinkMode, params: EmitApplyParams) =>
		({
			insert: () => adapter.emitInsert(params),
			modify: () => adapter.emitModify(params),
		})[mode]();

	onMount(() => {
		const viewCallback: LinkUpdateViewFn = () => urlModel.reset();
		const modeCallback: LinkUpdateModeFn = (value) => setCurrentMode(value);
		const displayTextCallback: LinkUpdateDisplayTextFn = (state) => {
			displayTextModel.setValue(state.inputValue);
			setDisplayTextDisabled(state.disabled);
		};
		const urlCallback: LinkUpdateURLFn = (state) =>
			urlModel.setValue(state.inputValue);
		const toggleButtonsCallback: LinkUpdateToggleButtonsFn = (state) =>
			setIsNewTab(state.isNewTab);

		adapter.subscribe({ type: "view", callback: viewCallback });
		adapter.subscribe({ type: "mode", callback: modeCallback });
		adapter.subscribe({ type: "displayText", callback: displayTextCallback });
		adapter.subscribe({ type: "url", callback: urlCallback });
		adapter.subscribe({
			type: "toggleButtons",
			callback: toggleButtonsCallback,
		});

		onCleanup(() => {
			adapter.unsubscribe({ type: "view", callback: viewCallback });
			adapter.unsubscribe({ type: "mode", callback: modeCallback });
			adapter.unsubscribe({
				type: "displayText",
				callback: displayTextCallback,
			});
			adapter.unsubscribe({ type: "url", callback: urlCallback });
			adapter.unsubscribe({
				type: "toggleButtons",
				callback: toggleButtonsCallback,
			});
		});
	});

	const onNewTabChange = () => {
		setIsNewTab((prev) => !prev);
	};

	const onCancel = () => {
		adapter.updateState({ view: "preview" });

		adapter.emitViewChange();
		adapter.emitCancel();
	};

	const onApply = () => {
		urlModel.validate();

		const hasError = urlModel.checkValidity().hasError;

		if (hasError) {
			return;
		}

		const rawUrl = urlModel.value();
		const normalizedUrl = allowedPrefixes.some((p) => rawUrl.startsWith(p))
			? rawUrl
			: `https://${rawUrl}`;

		adapter.updateState({ view: "preview" });

		adapter.emitViewChange();

		const applyParams: EmitApplyParams = {
			text: displayTextModel.value(),
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
					for={displayTextModel.id}
					label="Display Text"
					showError={displayTextModel.state().showError}
					errorMessage={displayTextModel.state().message}
				>
					<TextFieldWrapper appearance="primary-outline" size="medium">
						<InputTextField
							type="text"
							id={displayTextModel.id}
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
					for={urlModel.id}
					label="URL"
					showError={urlModel.state().showError}
					errorMessage={urlModel.state().message}
				>
					<TextFieldWrapper appearance="primary-outline" size="medium">
						<InputTextField
							type="text"
							id={urlModel.id}
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
