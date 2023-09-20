
import { z, defineCollection } from "astro:content";

// Image resolution logic:
//
// - If project type is "other", project image will be
//   "src/img/portfolio/<slug>.png"
//
// - If project type is "website", the project images will be
//   "src/img/portfolio/<slug>-<layout>.png" where "layout" is "desktop", "tablet"
//   and "mobile". The desktop image will be used as thumbnail.
//
const portfolioCollection = defineCollection(
    {
        type: "content",
        schema: z.object({
            clientName: z.string(),
            clientColor: z.string().regex(/^#[0-9a-zA-Z]{6}/),
            textColor: z.string().regex(/^#[0-9a-zA-Z]{6}/).optional(),
            projectDate: z.date(),

            // 1-3 words, e.g. "New website"
            summary: z.string(), 

            // Affects layout and image resolution logic
            projectType: z.enum(["website", "other"]),

            // Whether the logo is dark, in which case it must be drawn on a light background
            logoIsDark: z.boolean().optional().default(false)
        })
    }
);

export const collections = {
    "portfolio": portfolioCollection,
}
