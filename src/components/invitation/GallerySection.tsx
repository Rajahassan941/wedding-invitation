import { weddingConfig } from "@/config/wedding";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryGrid } from "./GalleryGrid";

export function GallerySection() {
  const { gallery } = weddingConfig;
  if (gallery.images.length === 0) return null;

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="paper relative overflow-hidden py-24 sm:py-32">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
        <SectionHeading id="gallery-title" eyebrow={gallery.eyebrow} title={gallery.heading} intro={gallery.intro} />
        <GalleryGrid images={gallery.images} />
      </div>
    </section>
  );
}
