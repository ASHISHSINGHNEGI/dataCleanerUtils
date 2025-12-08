export async function addCommunityToUserDoc(userDoc, community) {
  if (!userDoc || !community) return;
  if (!Array.isArray(userDoc.community)) userDoc.community = [];
  const exists = userDoc.community.some(
    (c) => c.id && c.id.equals && c.id.equals(community._id)
  );
  if (!exists) {
    userDoc.community.push({ name: community.name, id: community._id });
  }
}
