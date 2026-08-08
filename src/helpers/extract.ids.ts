export const extractIdFromSlug = (slug: string): number | null => {
  const parts = slug.split("-");
  const lastPart = parts[parts.length - 1];
  const id = Number(lastPart);
  return isNaN(id) ? null : id;
};