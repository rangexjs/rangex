import type { Plugin } from "vite-plus";

import type { ByteRange, DevUpload } from "./DevUploads-types";

const maxUploadSize = 100 * 1024 * 1024;

/*
 * Returns the bytes a Range header asks for (e.g. "bytes=0-1023", "bytes=1024-", "bytes=-500"), or null if it isn't
 * one this server can serve: the whole file is sent instead.
 */
const parseByteRange = (rangeHeader: string | undefined, size: number): ByteRange | null => {
	const match = rangeHeader?.match(/^bytes=(\d*)-(\d*)$/);

	if (!match) {
		return null;
	}

	const [, startText = "", endText = ""] = match;

	if (startText === "" && endText === "") {
		return null;
	}

	// A suffix range: the last bytes of the file
	if (startText === "") {
		const suffixLength = Number(endText);

		return { start: Math.max(size - suffixLength, 0), end: size - 1 };
	}

	const start = Number(startText);
	const end = endText === "" ? size - 1 : Math.min(Number(endText), size - 1);

	if (start > end) {
		return null;
	}

	return { start, end };
};

/*
 * Joins the chunks a request body arrived in.
 */
const joinChunks = (chunks: Uint8Array[], size: number) => {
	const data = new Uint8Array(size);
	let offset = 0;

	for (const chunk of chunks) {
		data.set(chunk, offset);
		offset += chunk.length;
	}

	return data;
};

/**
 * The path the dev server takes uploads at, and serves them from. Also in src/ExtensionSettings/SourcePlaceholder, which
 * uploads to it: this file can't be imported from src, as its Vite types would bring Node's into the browser code.
 */
export const devUploadsPath = "/__dev-uploads";

/**
 * Demo-only stand-in for an app's storage: a POST to devUploadsPath stores the file in memory and answers its URL,
 * which serves it back (with Range requests, so a video can seek). The files are lost once the dev server stops.
 */
export const devUploads = (): Plugin => {
	const uploads = new Map<string, DevUpload>();

	return {
		name: "dev-uploads",
		apply: "serve",
		configureServer: (server) => {
			server.middlewares.use(devUploadsPath, (request, response, next) => {
				const { pathname } = new URL(request.url ?? "/", "http://localhost");

				if (request.method === "POST" && pathname === "/") {
					const declaredSize = Number(request.headers["content-length"] ?? 0);

					if (declaredSize > maxUploadSize) {
						response.statusCode = 413;
						response.end();
						return;
					}

					const chunks: Uint8Array[] = [];
					let size = 0;

					request.on("data", (chunk: Uint8Array) => {
						chunks.push(chunk);
						size += chunk.length;
					});

					request.on("end", () => {
						const id = crypto.randomUUID();
						const contentType = request.headers["content-type"] ?? "application/octet-stream";

						uploads.set(id, { contentType, data: joinChunks(chunks, size) });

						response.statusCode = 201;
						response.setHeader("Content-Type", "text/plain");
						response.end(`${devUploadsPath}/${id}`);
					});
					return;
				}

				if (request.method !== "GET") {
					next();
					return;
				}

				const upload = uploads.get(pathname.slice(1));

				if (!upload) {
					response.statusCode = 404;
					response.end();
					return;
				}

				const { contentType, data } = upload;
				const range = parseByteRange(request.headers.range, data.length);

				response.setHeader("Content-Type", contentType);
				response.setHeader("Accept-Ranges", "bytes");

				if (!range) {
					response.setHeader("Content-Length", data.length);
					response.end(data);
					return;
				}

				const { start, end } = range;

				response.statusCode = 206;
				response.setHeader("Content-Range", `bytes ${start}-${end}/${data.length}`);
				response.setHeader("Content-Length", end - start + 1);
				response.end(data.subarray(start, end + 1));
			});
		},
	};
};
