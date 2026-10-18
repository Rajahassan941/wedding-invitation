import Image, { type ImageProps } from "next/image";

/**
 * next/image wrapper. SVG placeholders are served as-is (the optimiser does not
 * process SVG); real photographs (JPG/PNG/WebP/AVIF) are fully optimised.
 */
export function WeddingImage({ alt, unoptimized, ...props }: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  const isSvg = src.toLowerCase().endsWith(".svg");
  return <Image alt={alt} {...props} unoptimized={unoptimized ?? isSvg} />;
}
