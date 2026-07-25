import {
	createMemo,
	createSignal,
	createUniqueId,
	onCleanup,
	onMount,
} from "solid-js";
import type { VideoUIPort } from "#adapters";
import { assertNever } from "../../../../ErrorHandling";
import {
	ContentSwitch,
	type ContentSwitcherControls,
} from "../../../ContentSwitcher";
import { Icon } from "../../../Icon";
import {
	createTextFieldController,
	FormField,
	InputTextField,
	TextFieldWrapper,
} from "../../../InputFields";

type VideoSourceTab = "upload" | "url";

const sourceTabControls: ContentSwitcherControls<VideoSourceTab> = [
	{ id: "upload", node: "Upload" },
	{ id: "url", node: "URL" },
];

export interface VideoSwapPopoverProps {
	uiPort: VideoUIPort;
	popoverRef?: (element: HTMLDivElement) => void;
}

export const VideoSwapPopover = (props: VideoSwapPopoverProps) => {
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

	const [checkState, setCheckState] = createSignal(props.uiPort.swapCheckState);
	const isChecking = () => checkState().status === "checking";
	const isUploading = () => checkState().status === "uploading";
	const isBusy = () => isChecking() || isUploading();
	const uploadProgress = () => {
		const state = checkState();
		return state.status === "uploading" ? state.progress : 0;
	};
	const checkErrorMessage = () => {
		const state = checkState();
		return state.status === "error" ? state.message : "";
	};

	onMount(() => {
		const unsubscribe = props.uiPort.onSwapCheckStateUpdate(setCheckState);

		onCleanup(() => {
			unsubscribe();
		});
	});

	const [isOpen, setIsOpen] = createSignal(false);

	const onToggle = (event: ToggleEvent) => {
		setIsOpen(event.newState === "open");

		if (event.newState !== "closed") {
			return;
		}

		urlModel.reset();
		urlModel.setValue("");
		setSourceTab("upload");
		setFiles(null);
		setCheckState({ status: "idle" });

		if (fileInput) {
			fileInput.value = "";
		}
	};

	const onUpdateClick = (event: MouseEvent) => {
		event.preventDefault();

		const tab = sourceTab();

		if (tab === "url") {
			urlModel.validate();

			if (urlModel.checkValidity().hasError) {
				return;
			}

			props.uiPort.emitSwap({ source: "url", url: urlModel.value() });
			return;
		}

		if (tab === "upload") {
			const selectedFiles = files();

			if (!selectedFiles?.length) {
				return;
			}

			props.uiPort.emitSwap({ source: "file-upload", files: selectedFiles });
			return;
		}

		assertNever(tab);
	};

	const onChooseFileClick = () => {
		if (!fileInput) {
			throw new Error("FileInput can't be undefined.");
		}

		fileInput.click();
	};

	let updateButtonRef: HTMLButtonElement | undefined;

	const onKeyDown = (event: KeyboardEvent) => {
		if (!updateButtonRef) {
			throw new Error("UpdateButtonRef can't be undefined.");
		}

		if (event.key !== "Enter") {
			return;
		}

		updateButtonRef.click();
	};

	return (
		<span>
			<button
				type="button"
				commandfor={popoverId}
				command="toggle-popover"
				class="btn-menu-trigger flex items-center justify-center rounded p-1"
				data-is-checked={isOpen()}
				title="Swap"
			>
				<Icon name="Swap" class="size-4" />
			</button>

			<div
				ref={(el) => {
					props.uiPort.swapPopover.setElement(el);
					props.popoverRef?.(el);
				}}
				id={popoverId}
				popover="manual"
				class="w-64 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
				on:toggle={onToggle}
			>
				<input ref={fileInput} type="file" accept="video/*" class="hidden" />

				<ContentSwitch
					id={sourceTab()}
					controls={sourceTabControls}
					onChange={setSourceTab}
					disabled={isBusy()}
					class="mb-3 rounded-sm"
					commonButtonClass="py-1.5 text-xs font-medium"
					activeBoxShrink={-1}
					activeBoxClass="rounded-sm shadow border border-primary-500/40"
				/>

				<div class="mb-3" hidden={sourceTab() !== "upload"}>
					<button
						type="button"
						disabled={isBusy()}
						class="btn-neutral-solid w-full rounded-sm px-3 py-2 text-left font-medium text-sm"
						on:click={onChooseFileClick}
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
								on:keydown={onKeyDown}
							/>
						</TextFieldWrapper>
					</FormField>
				</div>

				<div class="mb-3 text-sm" hidden={checkState().status === "idle"}>
					<span
						hidden={!isChecking()}
						class="text-neutral-500 dark:text-neutral-400"
					>
						Checking…
					</span>
					<span
						hidden={!isUploading()}
						class="text-neutral-500 dark:text-neutral-400"
					>
						Uploading… {Math.round(uploadProgress() * 100)}%
					</span>
					<span
						hidden={checkState().status !== "error"}
						class="text-red-600 dark:text-red-400"
					>
						{checkErrorMessage()}
					</span>
				</div>

				<div class="flex justify-end gap-2">
					<button
						type="button"
						commandfor={popoverId}
						command="hide-popover"
						class="btn-neutral-solid rounded-sm px-4 py-1 font-semibold text-sm"
					>
						Cancel
					</button>
					<button
						ref={updateButtonRef}
						type="button"
						disabled={isBusy()}
						class="btn-primary-solid rounded-sm px-4 py-1 font-semibold text-sm"
						on:click={onUpdateClick}
					>
						Update
					</button>
				</div>
			</div>
		</span>
	);
};
