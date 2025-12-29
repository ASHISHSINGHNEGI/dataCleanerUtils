import { Community } from "../mongoose/models/community.model.js";
import { logger } from "./logger.js";

import { sanitizeFilename } from "./sanitizeFilename.js";

export async function findOrCreateCommunity(jobName, countryName) {
  let community = await Community.findOne({
    $or: [
      { tags: { $all: [jobName, countryName] } },
      { refName: sanitizeFilename(`${jobName} for ${countryName}`) },
    ],
  }).lean();
  logger({ lsls: { ...community } });
  if (!community) {
    console.log(`Creating community for ${jobName} in ${countryName}`);
    community = await Community.create({
      name: `${jobName} for ${countryName}`,
      tags: [jobName, countryName],
    });
  }
  console.log(`Community found or created for ${jobName} in ${countryName}`);
  return community;
}
