import type { MetadataRoute } from "next";
import { weddingConfig } from "@/config/wedding";

export default function robots(): MetadataRoute.Robots {
  return weddingConfig.meta.allowIndexing
    ? { rules: { userAgent: "*", allow: "/", disallow: "/api/" } }
    : { rules: { userAgent: "*", disallow: "/" } };
}
