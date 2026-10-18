import { weddingConfig } from "@/config/wedding";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/AnimatedSection";
import { FloralSprig } from "@/components/ui/FloralSprig";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WeddingImage } from "@/components/ui/WeddingImage";
import { cn } from "@/lib/utils";

/** Optional section — rendered only when `features.story` is true. */
export function StorySection() {
  const { story } = weddingConfig;
  if (story.paragraphs.length === 0) return null;
  const hasImage = Boolean(story.image);

  return (
    <section id="story" aria-labelledby="story-title" className="paper-beige relative overflow-hidden py-24 sm:py-32">
      <FloralSprig className="absolute -right-4 top-12 w-24 rotate-12 opacity-70 sm:w-32" flip />

      <div
        className={cn(
          "relative mx-auto px-5 sm:px-8",
          hasImage ? "grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-20" : "max-w-3xl",
        )}
      >
        {story.image && (
          <Reveal className="relative mx-auto aspect-[4/5] w-full max-w-md">
            <div aria-hidden="true" className="absolute -inset-3 rounded-t-full border border-gold/50" />
            <div className="relative h-full overflow-hidden rounded-t-full">
              <WeddingImage
                src={story.image.src}
                alt={story.image.alt}
                fill
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="object-cover"
                style={{ objectPosition: story.image.position ?? "50% 50%" }}
              />
            </div>
          </Reveal>
        )}

        <div className={cn(!hasImage && "text-center")}>
          <SectionHeading
            id="story-title"
            eyebrow={story.eyebrow}
            title={story.heading}
            className={cn(hasImage && "lg:mx-0 lg:text-left lg:[&_div[aria-hidden]]:justify-start")}
          />
          <RevealGroup className="mt-10 space-y-6">
            {story.paragraphs.map((paragraph, i) => (
              <RevealItem key={i}>
                <p
                  className={cn(
                    "font-serif text-xl leading-relaxed text-ink text-pretty sm:text-[1.4rem]",
                    i === 0 && "first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-gold",
                  )}
                >
                  {paragraph}
                </p>
              </RevealItem>
            ))}
            {story.signature && (
              <RevealItem>
                <p className="display-name pt-4 text-3xl text-emerald">{story.signature}</p>
              </RevealItem>
            )}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
