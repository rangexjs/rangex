import { createSignal, createUniqueId, onMount } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import {
	createTextFieldController,
	FormField,
	InputTextField,
	TextFieldWrapper,
} from "../../InputFields";
import {
	Dropdown,
	type DropdownList,
	FixedPosModal,
	ToolbarButton,
} from "../_Utilities";

export const ImageToolbarButton = () => {
	const { toolbarButtonsActionManager, nodeInsertionButtonsStateManager } =
		useToolbarButtonManagersContext();

	const { image } = nodeInsertionButtonsStateManager;

	const [checked, setChecked] = createSignal(false);
	const [disabled, setDisabled] = createSignal(image.disabled);

	nodeInsertionButtonsStateManager.subscribe({
		type: toolbarButtonsName.image,
		callback: (state) => {
			setDisabled(state.disabled);
		},
	});

	const imgURLModalId = createUniqueId();
	const popoverId = createUniqueId();

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;
		setChecked(newState === "open");
	};

	let fileInput: HTMLInputElement | undefined;

	onMount(() => {
		if (!fileInput) {
			throw new Error("FileInput can't be undefined.");
		}

		fileInput.addEventListener("change", () => {
			const { files } = fileInput;

			if (!files) {
				throw new Error("Files can't be null.");
			}

			toolbarButtonsActionManager.emitNodeInsertionChange({
				type: toolbarButtonsName.image,
				insertionType: "file-upload",
				files,
			});
		});
	});

	const list: DropdownList = [
		{
			text: "Upload from device",
			button: {
				"on:click": () => {
					if (!fileInput) {
						throw new Error("FileInput can't be undefined.");
					}

					fileInput.click();
				},
			},
		},
		{
			text: "Upload via URL",
			button: {
				commandfor: imgURLModalId,
				command: "show-modal",
			},
		},
	];

	const [urlModel, urlControls] = createTextFieldController({
		error: { required: { value: true, message: "Field can't be empty." } },
	});

	const insertImgURL = (event: MouseEvent) => {
		urlModel.validate();

		if (urlModel.state().hasError) {
			event.preventDefault();
			return;
		}

		toolbarButtonsActionManager.emitNodeInsertionChange({
			type: toolbarButtonsName.image,
			insertionType: "url",
			url: urlModel.value(),
		});
	};

	const onImgModalClose = () => {
		urlModel.reset();
		urlModel.setValue("");
	};

	let insertButtonRef: HTMLButtonElement | undefined;

	const handleUrlKeyDown = (event: KeyboardEvent) => {
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
				checked={checked()}
				disabled={disabled()}
				hasChevron={true}
				commandfor={popoverId}
				command="toggle-popover"
			>
				<Icon name="Image" class="size-4" />
			</ToolbarButton>

			<Dropdown
				id={popoverId}
				list={list}
				onToggle={onPopoverToggle}
				class="[position-area:bottom_center]"
			/>
			<input ref={fileInput} type="file" class="hidden" />
			<FixedPosModal id={imgURLModalId} onClose={onImgModalClose} title="Image">
				<FormField
					class="mb-4"
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
							on:keydown={handleUrlKeyDown}
						/>
					</TextFieldWrapper>
				</FormField>
				<div class="text-right">
					<button
						ref={insertButtonRef}
						type="button"
						commandfor={imgURLModalId}
						command="close"
						class="btn-primary-solid rounded-sm px-4 py-1 font-semibold text-sm"
						on:click={insertImgURL}
					>
						Insert
					</button>
				</div>
			</FixedPosModal>
		</span>
	);
};
