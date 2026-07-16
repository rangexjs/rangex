import { createMemo, createSignal, createUniqueId, onMount } from "solid-js";
import { assertNever } from "../../../ErrorHandling";
import { usePopoverControllersContext } from "../../App";
import {
	ContentSwitch,
	type ContentSwitcherControls,
} from "../../ContentSwitcher";
import {
	createTextFieldController,
	FormField,
	InputTextField,
	TextFieldWrapper,
} from "../../InputFields";

type VideoSourceTab = "upload" | "url";

const sourceTabControls: ContentSwitcherControls<VideoSourceTab> = [
	{ id: "upload", node: "Upload" },
	{ id: "url", node: "URL" },
];

export const VideoSwapPopover = () => {
	const { videoSwapPopoverController: controller } =
		usePopoverControllersContext();

	const popoverId = createUniqueId();

	const [sourceTab, setSourceTab] = createSignal<VideoSourceTab>("upload");
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

	const onToggle = (event: ToggleEvent) => {
		if (event.newState !== "closed") {
			return;
		}

		urlModel.reset();
		urlModel.setValue("");
		setSourceTab("upload");
		setFiles(null);

		if (fileInput) {
			fileInput.value = "";
		}
	};

	const onUpdateClick = (event: MouseEvent) => {
		const tab = sourceTab();

		if (tab === "url") {
			urlModel.validate();

			if (urlModel.checkValidity().hasError) {
				event.preventDefault();
				return;
			}

			controller.emitSwap({ source: "url", url: urlModel.value() });
			return;
		}

		if (tab === "upload") {
			const selectedFiles = files();

			if (!selectedFiles?.length) {
				event.preventDefault();
				return;
			}

			controller.emitSwap({ source: "file-upload", files: selectedFiles });
			return;
		}

		assertNever(tab);
	};

	let updateButtonRef: HTMLButtonElement | undefined;

	const handleKeyDown = (event: KeyboardEvent) => {
		if (!updateButtonRef) {
			throw new Error("UpdateButtonRef can't be undefined.");
		}

		if (event.key !== "Enter") {
			return;
		}

		updateButtonRef.click();
	};

	return (
		<div
			ref={(el) => controller.setPopover(el)}
			id={popoverId}
			popover="auto"
			class="w-64 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
			on:toggle={onToggle}
		>
			<input ref={fileInput} type="file" accept="video/*" class="hidden" />

			<ContentSwitch
				id={sourceTab()}
				controls={sourceTabControls}
				onChange={setSourceTab}
				class="mb-3 rounded-sm"
				commonButtonClass="py-1.5 text-xs font-medium"
				activeBoxShrink={-1}
				activeBoxClass="rounded-sm shadow border border-primary-500/40"
			/>

			<div class="mb-3" hidden={sourceTab() !== "upload"}>
				<button
					type="button"
					class="btn-neutral-solid w-full rounded-sm px-3 py-2 text-left font-medium text-sm"
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

			<div class="mb-3" hidden={sourceTab() !== "url"}>
				<FormField
					for={urlModel.id}
					showError={urlModel.state().showError}
					errorMessage={urlModel.state().message}
				>
					<TextFieldWrapper appearance="primary-outline" size="medium">
						<InputTextField
							type="text"
							id={urlModel.id}
							aria-label="URL"
							placeholder="https://example.com/video.mp4"
							spellcheck={false}
							{...urlControls}
							on:keydown={handleKeyDown}
						/>
					</TextFieldWrapper>
				</FormField>
			</div>

			<div class="text-right">
				<button
					ref={updateButtonRef}
					type="button"
					commandfor={popoverId}
					command="hide-popover"
					class="btn-primary-solid rounded-sm px-4 py-1 font-semibold text-sm"
					on:click={onUpdateClick}
				>
					Update
				</button>
			</div>
		</div>
	);
};
