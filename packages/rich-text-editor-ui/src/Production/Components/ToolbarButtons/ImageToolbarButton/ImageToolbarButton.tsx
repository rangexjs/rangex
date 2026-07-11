import { createMemo, createSignal, createUniqueId, onMount } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import { assertNever } from "../../../ErrorHandling";
import { useToolbarButtonManagersContext } from "../../App";
import {
	ContentSwitch,
	type ContentSwitcherControls,
} from "../../ContentSwitcher";
import { Icon } from "../../Icon";
import {
	createTextFieldController,
	FormField,
	InputTextField,
	TextFieldWrapper,
} from "../../InputFields";
import { FixedPosModal, ToolbarButton } from "../_Utilities";

type ImageSourceTab = "upload" | "url";

const sourceTabControls: ContentSwitcherControls<ImageSourceTab> = [
	{ id: "upload", node: "Upload" },
	{ id: "url", node: "URL" },
];

export const ImageToolbarButton = () => {
	const { toolbarButtonsActionManager, nodeInsertionButtonsStateManager } =
		useToolbarButtonManagersContext();

	const { image } = nodeInsertionButtonsStateManager;

	const [disabled, setDisabled] = createSignal(image.disabled);

	nodeInsertionButtonsStateManager.subscribe({
		type: toolbarButtonsName.image,
		callback: (state) => {
			setDisabled(state.disabled);
		},
	});

	const modalId = createUniqueId();

	const [sourceTab, setSourceTab] = createSignal<ImageSourceTab>("upload");
	const [files, setFiles] = createSignal<FileList | null>(null);
	const fileName = createMemo(() => files()?.item(0)?.name ?? null);

	let fileInput: HTMLInputElement | undefined;

	onMount(() => {
		if (!fileInput) {
			throw new Error("FileInput can't be undefined.");
		}

		fileInput.addEventListener("change", () => {
			setFiles(fileInput.files);
		});
	});

	const [urlModel, urlControls] = createTextFieldController({
		error: { required: { value: true, message: "Field can't be empty." } },
	});

	const [altModel, altControls] = createTextFieldController({});

	const onModalClose = () => {
		if (!fileInput) {
			throw new Error("FileInput can't be undefined.");
		}

		urlModel.reset();
		urlModel.setValue("");
		altModel.reset();
		altModel.setValue("");
		setSourceTab("upload");
		setFiles(null);
		fileInput.value = "";
	};

	const onInsertClick = (event: MouseEvent) => {
		const alt = altModel.value();
		const tab = sourceTab();

		if (tab === "url") {
			urlModel.validate();

			if (urlModel.checkValidity().hasError) {
				event.preventDefault();
				return;
			}

			toolbarButtonsActionManager.emitNodeInsertionChange({
				type: toolbarButtonsName.image,
				insertionType: "url",
				url: urlModel.value(),
				alt,
			});
			return;
		}

		if (tab === "upload") {
			const selectedFiles = files();

			if (!selectedFiles?.length) {
				event.preventDefault();
				return;
			}

			toolbarButtonsActionManager.emitNodeInsertionChange({
				type: toolbarButtonsName.image,
				insertionType: "file-upload",
				files: selectedFiles,
				alt,
			});
			return;
		}

		assertNever(tab);
	};

	let insertButtonRef: HTMLButtonElement | undefined;

	const handleKeyDown = (event: KeyboardEvent) => {
		if (!insertButtonRef) {
			throw new Error("InsertButtonRef can't be undefined.");
		}

		if (event.key !== "Enter") {
			return;
		}

		insertButtonRef.click();
	};

	return (
		<span>
			<ToolbarButton
				disabled={disabled()}
				commandfor={modalId}
				command="show-modal"
			>
				<Icon name="Image" class="size-4" />
			</ToolbarButton>

			<FixedPosModal id={modalId} onClose={onModalClose} title="Image">
				<input ref={fileInput} type="file" class="hidden" />

				<ContentSwitch
					id={sourceTab()}
					controls={sourceTabControls}
					onChange={setSourceTab}
					class="mb-3 rounded-sm"
					commonButtonClass="py-1.5 text-xs font-medium"
					activeBoxShrink={-1}
					activeBoxClass="rounded-sm shadow border border-primary-500/40"
				/>

				<div class="mb-4" hidden={sourceTab() !== "upload"}>
					<button
						type="button"
						class="btn-neutral-solid w-full rounded-sm px-3 py-1.5 text-left font-medium text-sm"
						on:click={() => {
							if (!fileInput) {
								throw new Error("FileInput can't be undefined.");
							}

							fileInput.click();
						}}
					>
						{fileName() ?? "Choose file…"}
					</button>
				</div>

				<div class="mb-4" hidden={sourceTab() !== "url"}>
					<FormField
						for={urlModel.id}
						label="URL"
						showError={urlModel.state().showError}
						errorMessage={urlModel.state().message}
					>
						<TextFieldWrapper appearance="primary-outline" size="medium">
							<InputTextField
								type="text"
								id={urlModel.id}
								placeholder="https://example.com/image.png"
								spellcheck={false}
								{...urlControls}
								on:keydown={handleKeyDown}
							/>
						</TextFieldWrapper>
					</FormField>
				</div>

				<FormField class="mb-4" for={altModel.id} label="Alt text">
					<TextFieldWrapper appearance="primary-outline" size="medium">
						<InputTextField
							type="text"
							id={altModel.id}
							placeholder="Describe the image"
							spellcheck={false}
							{...altControls}
							on:keydown={handleKeyDown}
						/>
					</TextFieldWrapper>
				</FormField>

				<div class="text-right">
					<button
						ref={insertButtonRef}
						type="button"
						commandfor={modalId}
						command="close"
						class="btn-primary-solid rounded-sm px-4 py-1 font-semibold text-sm"
						on:click={onInsertClick}
					>
						Insert
					</button>
				</div>
			</FixedPosModal>
		</span>
	);
};
