import type { FileId, MediaType, SourceType } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";

import {
  createSourceResolveDetail,
  detectSourceUrlType,
  isWellFormedUrl,
  validateSourceAttrs,
} from "../../_Utilities";
import type { SlotStatus } from "../SourcePlaceholderSlot-types";
import type {
  CreateSourceResolverParams,
  CreateSourceResolverResult,
} from "./CreateSourceResolver-types";

const sourceTypeNouns: Record<SourceType, string> = {
  image: "an image",
  video: "a video",
  audio: "an audio file",
  embed: "an embeddable page",
};

const listFormat = new Intl.ListFormat("en", {
  style: "long",
  type: "disjunction",
});

/*
 * The error of a link that's none of the supported source types, listing them.
 */
const createUnknownLinkMessage = (supportedSourceTypes: SourceType[]) => {
  const nouns = supportedSourceTypes.map((type) => sourceTypeNouns[type]);

  return `Couldn't find ${listFormat.format(nouns)} at that link.`;
};

/*
 * Takes a capture from a file or a link down to `sourcePlaceholder.resolve`, which replaces the placeholder: a file is uploaded
 * first (see uploadMediaFile), and a link's source type is detected (see detectSourceUrlType). The source's attributes
 * must be valid. Holds the status of the attempt. The upload and the detection are aborted once the placeholder is removed
 * (the slot is disposed with it).
 */
export const createSourceResolver = ({
  editor,
  sourcePlaceholder,
  container,
  settings,
}: CreateSourceResolverParams): CreateSourceResolverResult => {
  const [status, setStatus] = createSignal<SlotStatus>({ status: "idle" });

  const abortController = new AbortController();
  const { signal } = abortController;

  onCleanup(() => {
    abortController.abort();
  });

  /*
   * Uploads the file, reporting its progress. Returns the uploaded file's URL and id, or null if it couldn't be
   * uploaded or the slot was disposed meanwhile.
   */
  const uploadMediaFile = async (file: File) => {
    setStatus({ status: "uploading", progress: 0 });

    const uploadedFile = await settings
      .uploadFile({
        file,
        signal,
        onProgress: (progress) => {
          setStatus({ status: "uploading", progress });
        },
      })
      .catch(() => null);

    if (signal.aborted) {
      return null;
    }

    if (!uploadedFile) {
      setStatus({
        status: "error",
        message: "Couldn't upload that file. Try a different one.",
      });
      return null;
    }

    return uploadedFile;
  };

  /*
   * Replaces the placeholder with the source, if its attributes are valid.
   */
  const insertSource = (type: SourceType, src: string, fileId: FileId) => {
    const detail = createSourceResolveDetail({ type, src, fileId, settings });

    if (!validateSourceAttrs({ editor, detail })) {
      const message =
        detail.type === "embed"
          ? "This site can't be embedded."
          : `This ${detail.type} can't be inserted.`;

      setStatus({ status: "error", message });
      return;
    }

    sourcePlaceholder.resolve({ element: container, detail });
  };

  /*
   * An uploaded file's URL isn't checked: it comes from uploadFile, and it can be a relative one.
   */
  const resolveFile = async (type: MediaType, file: File) => {
    const uploadedFile = await uploadMediaFile(file);

    if (uploadedFile === null) {
      return;
    }

    insertSource(type, uploadedFile.src, uploadedFile.fileId);
  };

  const resolveUrl = async (url: string) => {
    if (!isWellFormedUrl(url)) {
      setStatus({ status: "error", message: "Enter a valid URL." });
      return;
    }

    setStatus({ status: "checking" });

    const detection = await detectSourceUrlType({
      editor,
      url,
      supportedSourceTypes: sourcePlaceholder.supportedSourceTypes,
      settings,
      signal,
    });

    if (signal.aborted) {
      return;
    }

    if (detection.status === "unknown") {
      setStatus({
        status: "error",
        message: createUnknownLinkMessage(sourcePlaceholder.supportedSourceTypes),
      });
      return;
    }

    insertSource(detection.type, detection.src, null);
  };

  return { status, resolveFile, resolveUrl };
};
