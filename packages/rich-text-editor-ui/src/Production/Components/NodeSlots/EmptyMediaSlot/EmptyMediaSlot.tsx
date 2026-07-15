import { createSignal, Show } from "solid-js";
import type {
	MediaResolveType,
	UploadState,
} from "../../../NodeSlotControllers";
import {
	ContentSwitch,
	type ContentSwitcherControls,
} from "../../ContentSwitcher";
import { Icon, type IconName } from "../../Icon";
import {
	createTextFieldController,
	FormField,
	InputTextField,
	TextFieldWrapper,
} from "../../InputFields";
import type { EmptyMediaSlotProps } from "./EmptyMediaSlot-types";

type MediaTab = "upload" | MediaResolveType;

const TabLabel = (icon: IconName, label: string) => (
	<span class="inline-flex items-center gap-1">
		<Icon name={icon} class="size-4" />
		<span class="hidden md:inline">{label}</span>
	</span>
);

interface UploadingIndicatorProps {
	uploadState: UploadState;
}

const UploadingIndicator = (props: UploadingIndicatorProps) => {
	const progress = () =>
		props.uploadState.status === "uploading" ? props.uploadState.progress : 0;

	return (
		<div
			class="mx-auto w-full max-w-125 flex-col items-center gap-2 text-neutral-500 text-sm dark:text-neutral-400"
			classList={{
				hidden: props.uploadState.status === "idle",
				flex: props.uploadState.status !== "idle",
			}}
		>
			<span>Uploading…</span>
			<span>{Math.round(progress() * 100)}%</span>
		</div>
	);
};

const urlPlaceholderByType: Record<MediaResolveType, string> = {
	image: "https://example.com/image.png",
	video: "https://example.com/video.mp4",
	audio: "https://example.com/audio.mp3",
	embed: "https://example.com/embed",
};

const detectDroppedFileType = (
	file: File,
): Exclude<MediaResolveType, "embed"> | null => {
	if (file.type.startsWith("image/")) {
		return "image";
	}
	if (file.type.startsWith("video/")) {
		return "video";
	}
	if (file.type.startsWith("audio/")) {
		return "audio";
	}
	return null;
};

/**
 * Dumb Solid UI for an unresolved media placeholder — drag&drop anywhere on the card, or a
 * ContentSwitcher between an Upload tab (file picker) and one URL tab per media type. Never
 * decides when it's "done": `uploadState` is pushed in from outside, and every capture just
 * forwards through `onResolve` — the caller owns uploading and resolution.
 */
export const EmptyMediaSlot = (props: EmptyMediaSlotProps) => {
	const [activeTab, setActiveTab] = createSignal<MediaTab>("upload");
	const [dragActive, setDragActive] = createSignal(false);

	const [urlModel, urlControls] = createTextFieldController({
		error: { required: { value: true, message: "Field can't be empty." } },
	});

	let fileInput: HTMLInputElement | undefined;

	const onTabChange = (tab: MediaTab) => {
		setActiveTab(tab);
		urlModel.reset();
		urlModel.setValue("");
	};

	const onUploadFileChange = (event: Event) => {
		const { currentTarget } = event;

		if (!(currentTarget instanceof HTMLInputElement)) {
			throw new Error("CurrentTarget must be an HTMLInputElement.");
		}

		const [file] = currentTarget.files ?? [];
		currentTarget.value = "";

		if (!file) {
			return;
		}

		const type = detectDroppedFileType(file);

		if (!type) {
			return;
		}

		props.onResolve({ type, insertionType: "file", file });
	};

	const onUrlApply = () => {
		const type = activeTab();

		if (type === "upload") {
			return;
		}

		urlModel.validate();

		if (urlModel.checkValidity().hasError) {
			return;
		}

		props.onResolve({ type, insertionType: "url", url: urlModel.value() });
	};

	const onUrlKeyDown = (event: KeyboardEvent) => {
		if (event.key !== "Enter") {
			return;
		}

		onUrlApply();
	};

	const onDragEnter = (event: DragEvent) => {
		event.preventDefault();
		setDragActive(true);
	};

	const onDragOver = (event: DragEvent) => {
		event.preventDefault();

		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = "copy";
		}
	};

	const onDragLeave = (event: DragEvent) => {
		event.preventDefault();
		setDragActive(false);
	};

	const onDrop = (event: DragEvent) => {
		event.preventDefault();
		setDragActive(false);

		const [file] = event.dataTransfer?.files ?? [];

		if (!file) {
			return;
		}

		const type = detectDroppedFileType(file);

		if (!type) {
			return;
		}

		props.onResolve({ type, insertionType: "file", file });
	};

	const mediaTabControls: ContentSwitcherControls<MediaTab> = [
		{
			id: "upload",
			node: TabLabel("FileArrowUp", "Upload"),
			"aria-label": "Upload",
		},
		{
			id: "image",
			node: TabLabel("FileImage", "Image"),
			"aria-label": "Image",
		},
		{
			id: "video",
			node: TabLabel("FileVideo", "Video"),
			"aria-label": "Video",
		},
		{
			id: "audio",
			node: TabLabel("FileAudio", "Audio"),
			"aria-label": "Audio",
		},
		{
			id: "embed",
			node: TabLabel("FileCloud", "Embed"),
			"aria-label": "Embed",
		},
	];

	return (
		<div
			class="flex flex-col rounded-lg border border-dashed p-4"
			classList={{
				"border-blue-400 bg-blue-50 dark:bg-blue-950": dragActive(),
				"border-neutral-300 dark:border-neutral-700": !dragActive(),
			}}
			on:dragenter={onDragEnter}
			on:dragover={onDragOver}
			on:dragleave={onDragLeave}
			on:drop={onDrop}
		>
			<div
				classList={{
					hidden: props.uploadState.status !== "idle",
					flex: props.uploadState.status === "idle",
				}}
				class="mx-auto w-full max-w-125 flex-col gap-3"
			>
				<div class="flex flex-col items-center gap-1 text-neutral-500 text-sm dark:text-neutral-400">
					<Icon name="FileArrowUp" class="size-6" />
					<span>Drag and drop, or choose a source below</span>
				</div>

				<ContentSwitch
					id={activeTab()}
					controls={mediaTabControls}
					onChange={onTabChange}
					class="rounded-sm"
					commonButtonClass="py-1.5 text-xs font-medium inline-flex items-center justify-center "
					activeBoxShrink={-1}
					activeBoxClass="rounded-sm shadow border border-primary-500/40"
				/>

				<div classList={{ hidden: activeTab() !== "upload" }}>
					<button
						type="button"
						class="btn-neutral-solid w-full rounded-sm px-3 py-1.5 text-left font-medium text-sm"
						onClick={() => fileInput?.click()}
					>
						Choose file…
					</button>
					<input
						ref={fileInput}
						type="file"
						accept="image/*,video/*,audio/*"
						class="hidden"
						onChange={onUploadFileChange}
					/>
				</div>

				<Show when={activeTab() !== "upload"}>
					<div class="flex flex-col gap-2">
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
									placeholder={
										urlPlaceholderByType[activeTab() as MediaResolveType]
									}
									spellcheck={false}
									{...urlControls}
									on:keydown={onUrlKeyDown}
								/>
							</TextFieldWrapper>
						</FormField>
						<div class="text-right">
							<button
								type="button"
								class="btn-primary-solid rounded-sm px-4 py-1 font-semibold text-sm"
								onClick={onUrlApply}
							>
								Apply
							</button>
						</div>
					</div>
				</Show>
			</div>

			<UploadingIndicator uploadState={props.uploadState} />
		</div>
	);
};
