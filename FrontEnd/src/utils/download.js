// Saves a Blob as a file in the browser.
export function saveBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}

// File name the server suggested (Content-Disposition), or the fallback.
export function filenameFromResponse(res, fallback) {
  const header = res?.headers?.["content-disposition"] || "";
  const match = header.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  return match ? decodeURIComponent(match[1]) : fallback;
}

/**
 * When a request uses responseType "blob", an error reply (JSON) also arrives
 * as a Blob — so error.response.data.message is NOT readable directly.
 * This reads the real message out of it so the admin sees the actual reason.
 */
export async function blobErrorMessage(error, fallback) {
  try {
    const data = error?.response?.data;
    if (data instanceof Blob) {
      const parsed = JSON.parse(await data.text());
      if (parsed?.message) return parsed.message;
    } else if (data?.message) {
      return data.message;
    }
  } catch {
    /* fall through */
  }
  if (!error?.response) return "Could not reach the server. Check that the backend is running.";
  return fallback;
}
