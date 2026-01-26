/**
 * Utility to merge class names.
 * This is a lightweight version of clsx + tailwind-merge.
 * It filters out falsy values (like false, null, undefined) and joins the rest with spaces.
 */
export function cn(...inputs) {
    return inputs.filter(Boolean).join(" ");
}
