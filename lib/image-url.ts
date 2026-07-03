type ImageOptions = {
  width?: number;
  height?: number;
  quality?: number;
};

export function getOptimizedImageUrl(src?: string, options: ImageOptions = {}) {
  if (!src) return "";

  const width = options.width ?? 640;
  const quality = options.quality ?? 78;

  if (src.includes("googleusercontent.com") && /=s\d+($|[?#])/.test(src)) {
    return src.replace(/=s\d+($|[?#])/, `=w${width}$1`);
  }

  try {
    const url = new URL(src);
    if (url.pathname.includes("/storage/buckets/") && url.pathname.includes("/files/") && url.pathname.endsWith("/view")) {
      url.pathname = url.pathname.replace(/\/view$/, "/preview");
      url.searchParams.set("width", String(width));
      if (options.height) url.searchParams.set("height", String(options.height));
      url.searchParams.set("quality", String(quality));
      url.searchParams.set("output", "webp");
      return url.toString();
    }
  } catch {}

  return src;
}

export function getImageSrcSet(src?: string, widths: number[] = [320, 640, 960]) {
  if (!src) return undefined;
  return widths.map((width) => `${getOptimizedImageUrl(src, { width })} ${width}w`).join(", ");
}
