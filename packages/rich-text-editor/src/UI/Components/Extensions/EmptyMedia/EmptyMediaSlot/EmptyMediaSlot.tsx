import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { MediaResolveDetail, UploadState } from "#adapters";
import type { MediaType } from "#ports";
import {
	ContentSwitch,
	type ContentSwitcherControls,
} from "../../../ContentSwitcher";
import { Icon, type IconName } from "../../../Icon";
import {
	createTextFieldState,
	FormField,
	InputTextField,
	TextFieldWrapper,
} from "../../../InputFields";
import type { EmptyMediaSlotProps } from "./EmptyMediaSlot-types";

type MediaTab = "upload" | MediaType;

const NoSupportedMediaTypes = () => (
	<div class="flex flex-col items-center gap-1 rounded-lg border border-neutral-300 border-dashed p-4 text-center text-neutral-500 text-sm dark:border-neutral-700 dark:text-neutral-400">
		<Icon name="WarningCircle" class="size-6" />
		<span>No media types are available</span>
		<span class="text-xs">
			This editor has no Image, Video, Audio, or Embed extension registered —
			add at least one to the `extensions` array passed to RichTextEditor to
			enable media insertion.
		</span>
	</div>
);

const TabLabel = (icon: IconName, label: string) => (
	<span class="inline-flex items-center gap-1">
		<Icon name={icon} class="size-4" />
		<span class="hidden md:inline">{label}</span>
	</span>
);

interface StatusIndicatorProps {
	uploadState: UploadState;
}

const StatusIndicator = (props: StatusIndicatorProps) => {
	const progress = () =>
		props.uploadState.status === "uploading" ? props.uploadState.progress : 0;

	const display = () =>
		props.uploadState.status === "checking" ||
		props.uploadState.status === "uploading"
			? "flex"
			: "none";

	return (
		<div
			class="mx-auto w-full max-w-125 flex-col items-center gap-2 text-neutral-500 text-sm dark:text-neutral-400"
			style={{ display: display() }}
		>
			<span hidden={props.uploadState.status !== "checking"}>Checking…</span>
			<span hidden={props.uploadState.status !== "uploading"}>
				Uploading… {Math.round(progress() * 100)}%
			</span>
		</div>
	);
};

const urlPlaceholderByType: Record<MediaType, string> = {
	image: "https://example.com/image.png",
	video: "https://example.com/video.mp4",
	audio: "https://example.com/audio.mp3",
	embed: "https://example.com/embed",
};

const detectDroppedFileType = (
	file: File,
	supportedMediaTypes: MediaType[],
): Exclude<MediaType, "embed"> | null => {
	if (file.type.startsWith("image/") && supportedMediaTypes.includes("image")) {
		return "image";
	}
	if (file.type.startsWith("video/") && supportedMediaTypes.includes("video")) {
		return "video";
	}
	if (file.type.startsWith("audio/") && supportedMediaTypes.includes("audio")) {
		return "audio";
	}
	return null;
};

const isFileDrag = (event: DragEvent) =>
	!!event.dataTransfer?.types.includes("Files");

const getMediaTabControls = (
	supportedMediaTypes: MediaType[],
): ContentSwitcherControls<MediaTab> => {
	const controls: ContentSwitcherControls<MediaTab> = [];

	if (
		supportedMediaTypes.includes("image") ||
		supportedMediaTypes.includes("video") ||
		supportedMediaTypes.includes("audio")
	) {
		controls.push({
			id: "upload",
			node: TabLabel("FileArrowUp", "Upload"),
			"aria-label": "Upload",
		});
	}

	if (supportedMediaTypes.includes("image")) {
		controls.push({
			id: "image",
			node: TabLabel("FileImage", "Image"),
			"aria-label": "Image",
		});
	}

	if (supportedMediaTypes.includes("video")) {
		controls.push({
			id: "video",
			node: TabLabel("FileVideo", "Video"),
			"aria-label": "Video",
		});
	}

	if (supportedMediaTypes.includes("audio")) {
		controls.push({
			id: "audio",
			node: TabLabel("FileAudio", "Audio"),
			"aria-label": "Audio",
		});
	}

	if (supportedMediaTypes.includes("embed")) {
		controls.push({
			id: "embed",
			node: TabLabel("FileCloud", "Embed"),
			"aria-label": "Embed",
		});
	}

	if (!controls.length) {
		throw new Error("No tabs available for the supported media types.");
	}

	return controls;
};

/**
 * Dumb Solid UI for an unresolved media placeholder — drag&drop anywhere on the card, or a
 * ContentSwitcher between an Upload tab (file picker) and one URL tab per media type. Never
 * decides when it's "done": `uploadState` is read from `uiPort` and kept live via
 * subscription, and every capture just forwards through `uiPort.emitResolve` — the Editor
 * side owns uploading and resolution.
 */
export const EmptyMediaSlot = (props: EmptyMediaSlotProps) => {
	const supportedMediaTypes = props.uiPort.supportedMediaTypes;

	if (!supportedMediaTypes.length) {
		return <NoSupportedMediaTypes />;
	}

	const [uploadState, setUploadState] = createSignal(
		props.uiPort.getUploadState(props.element),
	);

	onMount(() => {
		const unsubscribe = props.uiPort.onUploadStateUpdate(
			props.element,
			setUploadState,
		);

		onCleanup(() => {
			unsubscribe();
		});
	});

	const onResolve = (detail: MediaResolveDetail) => {
		props.uiPort.emitResolve({ element: props.element, detail });
	};

	const mediaTabControls = getMediaTabControls(supportedMediaTypes);

	const uploadFileAccept = supportedMediaTypes
		.filter((type) => type !== "embed")
		.map((type) => `${type}/*`)
		.join(",");

	const [activeTab, setActiveTab] = createSignal<MediaTab>(
		mediaTabControls[0].id,
	);
	const [dragActive, setDragActive] = createSignal(false);
	// dragenter/dragleave fire on every child crossed too, bubbling — a depth counter is
	// needed to tell "left a child" apart from "left the dropzone entirely".
	let dragDepth = 0;

	const [urlHandle, urlControls] = createTextFieldState<HTMLInputElement>({
		error: { required: { value: true, message: "Field can't be empty." } },
	});

	const [uploadFile, setUploadFile] = createSignal<File | null>(null);
	const uploadFileName = createMemo(() => uploadFile()?.name ?? null);

	const errorMessage = () => {
		const state = uploadState();
		return state.status === "error" ? state.message : "";
	};

	const pickerDisplay = () =>
		uploadState().status === "idle" || uploadState().status === "error"
			? "flex"
			: "none";

	let fileInput: HTMLInputElement | undefined;

	const onTabChange = (tab: MediaTab) => {
		setActiveTab(tab);
		urlHandle.reset();
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

		const type = detectDroppedFileType(file, supportedMediaTypes);

		if (!type) {
			return;
		}

		setUploadFile(file);
	};

	const onApply = () => {
		const tab = activeTab();

		if (tab === "upload") {
			const file = uploadFile();

			if (!file) {
				return;
			}

			const type = detectDroppedFileType(file, supportedMediaTypes);

			if (!type) {
				return;
			}

			onResolve({ type, insertionType: "file", file });
			return;
		}

		urlHandle.validate();

		if (urlHandle.state().hasError) {
			return;
		}

		onResolve({ type: tab, insertionType: "url", url: urlHandle.value() });
	};

	const onUrlKeyDown = (event: KeyboardEvent) => {
		if (event.key !== "Enter") {
			return;
		}

		onApply();
	};

	const onDragEnter = (event: DragEvent) => {
		if (!isFileDrag(event)) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();
		dragDepth += 1;
		setDragActive(true);
	};

	const onDragOver = (event: DragEvent) => {
		if (!isFileDrag(event)) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = "copy";
		}
	};

	const onDragLeave = (event: DragEvent) => {
		if (!isFileDrag(event)) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();
		dragDepth -= 1;

		if (dragDepth <= 0) {
			dragDepth = 0;
			setDragActive(false);
		}
	};

	const onDrop = (event: DragEvent) => {
		if (!isFileDrag(event)) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();
		dragDepth = 0;
		setDragActive(false);

		const [file] = event.dataTransfer?.files ?? [];

		if (!file) {
			return;
		}

		const type = detectDroppedFileType(file, supportedMediaTypes);

		if (!type) {
			return;
		}

		onResolve({ type, insertionType: "file", file });
	};

	const stopEditorPropagation = (event: Event) => {
		event.stopPropagation();
	};

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
			on:keydown={stopEditorPropagation}
			on:beforeinput={stopEditorPropagation}
			on:paste={stopEditorPropagation}
			on:copy={stopEditorPropagation}
			on:cut={stopEditorPropagation}
		>
			<div
				style={{ display: pickerDisplay() }}
				class="mx-auto w-full max-w-125 flex-col gap-3"
			>
				<div class="flex flex-col items-center gap-1 text-neutral-500 text-sm dark:text-neutral-400">
					<Icon name="FileArrowUp" class="size-6" />
					<span>Drag and drop, or choose a source below</span>
				</div>

				<div
					hidden={uploadState().status !== "error"}
					class="rounded-sm bg-red-50 px-3 py-2 text-red-600 text-sm dark:bg-red-950 dark:text-red-400"
				>
					{errorMessage()}
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
						class="btn-neutral-solid w-full rounded-sm px-3 py-2 text-left font-medium text-sm"
						onClick={() => fileInput?.click()}
					>
						{uploadFileName() ?? "Choose file…"}
					</button>
					<input
						ref={fileInput}
						type="file"
						accept={uploadFileAccept}
						class="hidden"
						onChange={onUploadFileChange}
					/>
				</div>

				<FormField
					for={urlHandle.id}
					class={activeTab() === "upload" ? "hidden" : ""}
					state={urlHandle.state()}
				>
					<TextFieldWrapper appearance="primary-outline" size="medium">
						<InputTextField
							type="text"
							aria-label="URL"
							placeholder={urlPlaceholderByType[activeTab() as MediaType]}
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
						onClick={onApply}
					>
						Apply
					</button>
				</div>
			</div>

			<StatusIndicator uploadState={uploadState()} />
		</div>
	);
};
