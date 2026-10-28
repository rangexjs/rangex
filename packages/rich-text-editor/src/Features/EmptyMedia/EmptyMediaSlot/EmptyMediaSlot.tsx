import type { MediaType, RangeXEditor } from "@rangex/editor";
import type { EmbedAttrs } from "@rangex/editor/embed";
import type {
	MediaResolveDetail,
	UploadStatus,
} from "@rangex/editor/empty-media";
import { createMemo, createSignal, flush, onCleanup } from "solid-js";
import {
	createTextFieldState,
	FormField,
	Icon,
	type IconName,
	InputTextField,
	SegmentedControl,
	type SegmentedControlControls,
	TextFieldWrapper,
} from "#ui";

type MediaTab = "upload" | MediaType;

const NoSupportedMediaTypes = () => (
	<div class="flex flex-col items-center gap-1 rounded-lg border border-neutral-300 border-dashed p-4 text-center text-neutral-500 text-sm dark:border-neutral-700 dark:text-neutral-400">
		<Icon name="WarningCircle" class="size-6" />
		<span>No media types are available</span>
		<span class="text-xs">
			This editor has no Image, Video, Audio, or Embed extension registered —
			add at least one to the `extensions` array passed to createRichTextEditor
			to enable media insertion.
		</span>
	</div>
);

const TabLabel = (icon: IconName, label: string) => (
	<span class="inline-flex items-center gap-1">
		<Icon name={icon} class="size-4" />
		<span class="sr-only md:not-sr-only">{label}</span>
	</span>
);

interface StatusIndicatorProps {
	uploadStatus: UploadStatus;
}

const StatusIndicator = (props: StatusIndicatorProps) => {
	const progress = () =>
		props.uploadStatus.status === "uploading" ? props.uploadStatus.progress : 0;

	const display = () =>
		props.uploadStatus.status === "checking" ||
		props.uploadStatus.status === "uploading"
			? "flex"
			: "none";

	return (
		<div
			role="status"
			class="mx-auto w-full max-w-125 flex-col items-center gap-2 text-neutral-500 text-sm dark:text-neutral-400"
			style={{ display: display() }}
		>
			<span hidden={props.uploadStatus.status !== "checking"}>Checking…</span>
			<span hidden={props.uploadStatus.status !== "uploading"}>
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
): SegmentedControlControls<MediaTab> => {
	const controls: SegmentedControlControls<MediaTab> = [];

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

export interface EmptyMediaSlotSettings {
	// Turns a pasted embed URL into the one to frame (e.g. a share link into its embed URL)
	transformEmbedURL?: (url: string) => string;
	// The iframe's other attributes every Embed is inserted with (e.g. its sandbox)
	embedIframeAttrs?: Omit<EmbedAttrs["iframe"], "src">;
}

export interface EmptyMediaSlotProps {
	editor: RangeXEditor;
	container: HTMLDivElement;
	settings: EmptyMediaSlotSettings;
}

interface CreateMediaResolveDetailParams {
	type: MediaType;
	src: string | File;
	settings: EmptyMediaSlotSettings;
}

/*
 * Builds every attribute of the media to insert: centered, with the media element's src and its defaults (e.g. an
 * image's object fit, a video's controls). An embed's URL is transformed first (see transformEmbedURL), and its iframe
 * gets the configured attributes.
 */
const createMediaResolveDetail = ({
	type,
	src,
	settings,
}: CreateMediaResolveDetailParams): MediaResolveDetail => {
	const line = { "data-block-align": "center" };

	if (type === "image") {
		return {
			type,
			attrs: {
				line,
				block: {},
				img: { src, alt: "", "data-object-fit": "cover" },
			},
		};
	}

	if (type === "video") {
		return {
			type,
			attrs: {
				line,
				block: {},
				video: { src, controls: "", "data-object-fit": "cover" },
			},
		};
	}

	if (type === "audio") {
		return {
			type,
			attrs: { line, block: {}, audio: { src, controls: "" } },
		};
	}

	if (typeof src !== "string") {
		throw new Error("An embed's src must be a URL.");
	}

	const { transformEmbedURL = (url) => url, embedIframeAttrs = {} } = settings;

	return {
		type,
		attrs: {
			line,
			block: {},
			iframe: { ...embedIframeAttrs, src: transformEmbedURL(src) },
		},
	};
};

/**
 * Dumb Solid UI for an unresolved media placeholder — drag&drop anywhere on the card, or a
 * SegmentedControl between an Upload tab (file picker) and one URL tab per media type. Never
 * decides when it's "done": `uploadStatus` is read from `emptyMedia` and kept live via
 * subscription, and every capture just forwards through `emptyMedia.resolve` — the Editor
 * side owns uploading and resolution.
 */
export const EmptyMediaSlot = (props: EmptyMediaSlotProps) => {
	const { emptyMedia } = props.editor;

	if (!emptyMedia) {
		throw new Error("EmptyMedia can't be undefined.");
	}

	const supportedMediaTypes = emptyMedia.supportedMediaTypes;

	if (!supportedMediaTypes.length) {
		return <NoSupportedMediaTypes />;
	}

	const [uploadStatus, setUploadStatus] = createSignal(
		emptyMedia.getUploadStatus(props.container),
	);

	onCleanup(emptyMedia.onUploadStatusUpdate(props.container, setUploadStatus));

	const onResolve = (type: MediaType, src: string | File) => {
		const detail = createMediaResolveDetail({
			type,
			src,
			settings: props.settings,
		});

		emptyMedia.resolve({ element: props.container, detail });
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
		const state = uploadStatus();
		return state.status === "error" ? state.message : "";
	};

	const pickerDisplay = () =>
		uploadStatus().status === "idle" || uploadStatus().status === "error"
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

			onResolve(type, file);
			return;
		}

		urlHandle.validate();

		flush();

		if (urlHandle.state().hasError) {
			return;
		}

		onResolve(tab, urlHandle.value());
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

		onResolve(type, file);
	};

	const stopEditorPropagation = (event: Event) => {
		event.stopPropagation();
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: drag-and-drop dropzone container; the keydown/paste/copy/cut handlers only stop propagation into the editor underneath, they aren't a real interactive control
		<div
			class={[
				"flex flex-col rounded-lg border border-dashed p-4",
				{
					"border-blue-400 bg-blue-50 dark:bg-blue-950": dragActive(),
					"border-neutral-300 dark:border-neutral-700": !dragActive(),
				},
			]}
			onDragEnter={onDragEnter}
			onDragOver={onDragOver}
			onDragLeave={onDragLeave}
			onDrop={onDrop}
			onKeyDown={stopEditorPropagation}
			onBeforeInput={stopEditorPropagation}
			onPointerDown={stopEditorPropagation}
			onPaste={stopEditorPropagation}
			onCopy={stopEditorPropagation}
			onCut={stopEditorPropagation}
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
					role="alert"
					hidden={uploadStatus().status !== "error"}
					class="rounded-sm bg-red-50 px-3 py-2 text-red-600 text-sm dark:bg-red-950 dark:text-red-400"
				>
					{errorMessage()}
				</div>

				<SegmentedControl
					id={activeTab()}
					controls={mediaTabControls}
					onChange={onTabChange}
					label="Media source"
					appearance="primary-outline"
					class="rounded-sm border-solid"
					commonButtonClass="inline-flex items-center justify-center py-1.5 font-medium text-xs"
				/>

				<div class={{ hidden: activeTab() !== "upload" }}>
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
							onKeyDown={onUrlKeyDown}
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

			<StatusIndicator uploadStatus={uploadStatus()} />
		</div>
	);
};
