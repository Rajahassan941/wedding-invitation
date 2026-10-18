import { ImageResponse } from "next/og";
import { weddingConfig } from "@/config/wedding";
import { formatLongDate } from "@/lib/date";
import { getOrderedCouple } from "@/lib/wedding";

/** Social preview image, generated at build time from the wedding config. */
export const alt = weddingConfig.meta.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const { theme, wedding, meta, couple } = weddingConfig;
  const { ivory, gold, emerald } = theme.colors;
  const [first, second] = getOrderedCouple();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: emerald,
          padding: 36,
        }}
      >
        <div
          style={{
            flex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${gold}`,
            outline: `1px solid ${gold}`,
            outlineOffset: -14,
            color: ivory,
            fontFamily: "serif",
          }}
        >
          <div style={{ fontSize: 22, letterSpacing: 10, textTransform: "uppercase", color: gold }}>
            {wedding.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 36, fontSize: 92, fontStyle: "italic" }}>
            <span>{first.displayName}</span>
            <span style={{ color: gold, fontSize: 64 }}>{couple.joiner}</span>
            <span>{second.displayName}</span>
          </div>
          <div style={{ width: 220, height: 1, background: gold, marginTop: 36 }} />
          <div style={{ marginTop: 30, fontSize: 28, letterSpacing: 4, textTransform: "uppercase" }}>
            {formatLongDate(wedding.date, meta.locale, wedding.timezone)}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
