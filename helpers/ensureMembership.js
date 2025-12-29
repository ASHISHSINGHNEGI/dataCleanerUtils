import { logger } from "./logger.js";
import { communityMembership } from "../mongoose/models/communityMembership.model.js";

export async function ensureMembership(userId, communityId) {
  logger({ message: "Ensuring membership", userId, communityId });
  if (!userId || !communityId) return;

  try {
    //check if user is already a member of the community
    const existingMembership = await communityMembership.findOne({
      userId,
      communityId,
    });
    logger({
      message: "Membership already exists",
      userId,
      communityId,
      existingMembership,
    });

    if (existingMembership) return;

    // membershipSchema has unique index on (userId, communityId), so duplicates are avoided
    const membershipDoc = await communityMembership.create({
      userId,
      communityId,
      role: "member",
      status: "active",
    });
    logger({
      message: "Membership created",
      userId,
      communityId,
      membershipDoc,
    });
  } catch (err) {
    // ignore duplicate key error (11000)
    if (err.code && err.code === 11000) return;
    throw err;
  }
}
