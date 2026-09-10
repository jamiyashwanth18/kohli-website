/**
 * Back-compat entry point. The one sprite renderer for both screens lives in
 * `@/lib/pixel` (AC-030) -- this file only re-exports it so older imports
 * keep working without a second implementation existing anywhere.
 */
export { Pixel, spriteNameFromIllustration } from "@/lib/pixel";
