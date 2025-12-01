export function sanitizeFilename(name) {
  return name
    .replace(/[\u0000-\u001F\u007F]/g, "") // remove control chars
    .replace(/\s+/g, "_") // spaces → underscores
    .replace(/[^a-zA-Z0-9._-]/g, "") // remove unsafe symbols except ._- (optional)
    .toLowerCase();
}
