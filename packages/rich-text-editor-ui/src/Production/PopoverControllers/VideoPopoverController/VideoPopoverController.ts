import { assertNever } from "../../ErrorHandling";
import type {
	BlockAlignValue,
	OnAlignChangeFn,
	OnDeleteFn,
	UpdateAlignFn,
} from "../ImageEditPopoverController";
import type {
	OnPlaybackChangeFn,
	OnPosterChangeFn,
	OnTitleChangeFn,
	OnVideoAspectRatioChangeFn,
	OnVideoCaptionEnabledChangeFn,
	OnVideoCaptionPositionChangeFn,
	OnVideoObjectFitChangeFn,
	OnVideoSwapFn,
	UpdatePlaybackFn,
	UpdatePosterFn,
	UpdateTitleFn,
	UpdateVideoAspectRatioFn,
	UpdateVideoCaptionFn,
	UpdateVideoObjectFitFn,
	UpdateVideoPopoverStateParams,
	VideoAspectRatioValue,
	VideoCaptionPosition,
	VideoCaptionState,
	VideoEmitSwapParams,
	VideoListenerOption,
	VideoObjectFitValue,
	VideoPlaybackState,
	VideoPopover,
	VideoUpdateListenerParams,
} from "./VideoPopoverController-types";

export class VideoPopoverController {
	#popover: HTMLDivElement | null = null;
	#align: BlockAlignValue = "center";
	#objectFit: VideoObjectFitValue = "cover";
	#aspectRatio: VideoAspectRatioValue = "auto";
	#caption: VideoCaptionState = { enabled: false, position: "below" };
	#playback: VideoPlaybackState = {
		controls: true,
		autoplay: false,
		loop: false,
		muted: false,
	};
	#poster = "";
	#title = "";

	#alignListeners: Set<UpdateAlignFn> = new Set();
	#objectFitListeners: Set<UpdateVideoObjectFitFn> = new Set();
	#aspectRatioListeners: Set<UpdateVideoAspectRatioFn> = new Set();
	#captionListeners: Set<UpdateVideoCaptionFn> = new Set();
	#playbackListeners: Set<UpdatePlaybackFn> = new Set();
	#posterListeners: Set<UpdatePosterFn> = new Set();
	#titleListeners: Set<UpdateTitleFn> = new Set();

	#onAlignChangeListeners: Set<OnAlignChangeFn> = new Set();
	#onObjectFitChangeListeners: Set<OnVideoObjectFitChangeFn> = new Set();
	#onAspectRatioChangeListeners: Set<OnVideoAspectRatioChangeFn> = new Set();
	#onCaptionEnabledChangeListeners: Set<OnVideoCaptionEnabledChangeFn> =
		new Set();
	#onCaptionPositionChangeListeners: Set<OnVideoCaptionPositionChangeFn> =
		new Set();
	#onPlaybackChangeListeners: Set<OnPlaybackChangeFn> = new Set();
	#onPosterChangeListeners: Set<OnPosterChangeFn> = new Set();
	#onTitleChangeListeners: Set<OnTitleChangeFn> = new Set();
	#onSwapListeners: Set<OnVideoSwapFn> = new Set();
	#onDeleteListeners: Set<OnDeleteFn> = new Set();

	get align() {
		return this.#align;
	}

	get objectFit() {
		return this.#objectFit;
	}

	get aspectRatio() {
		return this.#aspectRatio;
	}

	get caption() {
		return this.#caption;
	}

	get playback() {
		return this.#playback;
	}

	get poster() {
		return this.#poster;
	}

	get title() {
		return this.#title;
	}

	#updateListener({ type, callback, operation }: VideoUpdateListenerParams) {
		if (type === "align") {
			this.#alignListeners[operation](callback);
			return;
		}

		if (type === "objectFit") {
			this.#objectFitListeners[operation](callback);
			return;
		}

		if (type === "aspectRatio") {
			this.#aspectRatioListeners[operation](callback);
			return;
		}

		if (type === "caption") {
			this.#captionListeners[operation](callback);
			return;
		}

		if (type === "playback") {
			this.#playbackListeners[operation](callback);
			return;
		}

		if (type === "poster") {
			this.#posterListeners[operation](callback);
			return;
		}

		if (type === "title") {
			this.#titleListeners[operation](callback);
			return;
		}

		assertNever(type);
	}

	subscribe(params: VideoListenerOption) {
		this.#updateListener({ ...params, operation: "add" });
	}

	unsubscribe(params: VideoListenerOption) {
		this.#updateListener({ ...params, operation: "delete" });
	}

	emitAlignChange(align: BlockAlignValue) {
		for (const listener of this.#onAlignChangeListeners) {
			listener(align);
		}
	}

	emitObjectFitChange(objectFit: VideoObjectFitValue) {
		for (const listener of this.#onObjectFitChangeListeners) {
			listener(objectFit);
		}
	}

	emitAspectRatioChange(aspectRatio: VideoAspectRatioValue) {
		for (const listener of this.#onAspectRatioChangeListeners) {
			listener(aspectRatio);
		}
	}

	emitCaptionEnabledChange(enabled: boolean) {
		for (const listener of this.#onCaptionEnabledChangeListeners) {
			listener(enabled);
		}
	}

	emitCaptionPositionChange(position: VideoCaptionPosition) {
		for (const listener of this.#onCaptionPositionChangeListeners) {
			listener(position);
		}
	}

	emitPlaybackChange(playback: Partial<VideoPlaybackState>) {
		for (const listener of this.#onPlaybackChangeListeners) {
			listener(playback);
		}
	}

	emitPosterChange(poster: string) {
		for (const listener of this.#onPosterChangeListeners) {
			listener(poster);
		}
	}

	emitTitleChange(title: string) {
		for (const listener of this.#onTitleChangeListeners) {
			listener(title);
		}
	}

	emitSwap(params: VideoEmitSwapParams) {
		for (const listener of this.#onSwapListeners) {
			listener(params);
		}
	}

	emitDelete() {
		for (const listener of this.#onDeleteListeners) {
			listener();
		}
	}

	updateState({
		align,
		objectFit,
		aspectRatio,
		caption,
		playback,
		poster,
		title,
	}: UpdateVideoPopoverStateParams) {
		if (align) {
			this.#align = align;

			for (const listener of this.#alignListeners) {
				listener(this.#align);
			}
		}

		if (objectFit) {
			this.#objectFit = objectFit;

			for (const listener of this.#objectFitListeners) {
				listener(this.#objectFit);
			}
		}

		if (aspectRatio) {
			this.#aspectRatio = aspectRatio;

			for (const listener of this.#aspectRatioListeners) {
				listener(this.#aspectRatio);
			}
		}

		if (caption) {
			this.#caption = caption;

			for (const listener of this.#captionListeners) {
				listener(this.#caption);
			}
		}

		if (playback) {
			this.#playback = playback;

			for (const listener of this.#playbackListeners) {
				listener(this.#playback);
			}
		}

		if (poster !== undefined) {
			this.#poster = poster;

			for (const listener of this.#posterListeners) {
				listener(this.#poster);
			}
		}

		if (title !== undefined) {
			this.#title = title;

			for (const listener of this.#titleListeners) {
				listener(this.#title);
			}
		}
	}

	setPopover(element: HTMLDivElement) {
		this.#popover = element;
	}

	get publicAPI(): VideoPopover {
		const controller = this;

		return {
			get popover() {
				if (!controller.#popover) {
					throw new Error("PopoverNode shouldn't be null.");
				}

				return controller.#popover;
			},

			updateState: (params) => this.updateState(params),

			onAlignChange: (callback) => {
				this.#onAlignChangeListeners.add(callback);
				return () => this.#onAlignChangeListeners.delete(callback);
			},

			onObjectFitChange: (callback) => {
				this.#onObjectFitChangeListeners.add(callback);
				return () => this.#onObjectFitChangeListeners.delete(callback);
			},

			onAspectRatioChange: (callback) => {
				this.#onAspectRatioChangeListeners.add(callback);
				return () => this.#onAspectRatioChangeListeners.delete(callback);
			},

			onCaptionEnabledChange: (callback) => {
				this.#onCaptionEnabledChangeListeners.add(callback);
				return () => this.#onCaptionEnabledChangeListeners.delete(callback);
			},

			onCaptionPositionChange: (callback) => {
				this.#onCaptionPositionChangeListeners.add(callback);
				return () => this.#onCaptionPositionChangeListeners.delete(callback);
			},

			onPlaybackChange: (callback) => {
				this.#onPlaybackChangeListeners.add(callback);
				return () => this.#onPlaybackChangeListeners.delete(callback);
			},

			onPosterChange: (callback) => {
				this.#onPosterChangeListeners.add(callback);
				return () => this.#onPosterChangeListeners.delete(callback);
			},

			onTitleChange: (callback) => {
				this.#onTitleChangeListeners.add(callback);
				return () => this.#onTitleChangeListeners.delete(callback);
			},

			onSwap: (callback) => {
				this.#onSwapListeners.add(callback);
				return () => this.#onSwapListeners.delete(callback);
			},

			onDelete: (callback) => {
				this.#onDeleteListeners.add(callback);
				return () => this.#onDeleteListeners.delete(callback);
			},
		};
	}
}
