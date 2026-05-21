export function getAssetPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  // Handle absolute external paths
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  // Ensure we have a leading slash if not present
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}
