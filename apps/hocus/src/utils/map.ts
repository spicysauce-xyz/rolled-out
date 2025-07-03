export const addUserIdToEditorsMap = (
  map: Map<string, Set<string>>,
  documentName: string,
  userId: string
) => {
  if (!map.has(documentName)) {
    map.set(documentName, new Set());
  }

  const set = map.get(documentName);

  if (set && userId) {
    set.add(userId);
  }
};
