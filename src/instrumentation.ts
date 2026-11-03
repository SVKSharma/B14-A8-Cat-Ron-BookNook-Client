import type { Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  const details = error instanceof Error
    ? {
        name: error.name,
        message: error.message,
        digest: "digest" in error && typeof error.digest === "string"
          ? error.digest
          : undefined,
      }
    : { message: String(error) };

  console.error("[next] Request rendering failed", {
    ...details,
    method: request.method,
    path: new URL(request.path, "http://localhost").pathname,
    route: context.routePath,
    routeType: context.routeType,
    renderSource: context.renderSource,
  });
};
