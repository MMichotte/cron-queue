import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config();

import { PreCheckError, preCheck } from "./core/pre-check";
import { logger } from "./shared/logger";
import { healthCheck } from "./modules/health-check/health-check";

logger.info("Node application started.");

try {
  preCheck();
} catch (e: any) {
  if (e instanceof PreCheckError) {
    logger.error(e.message, () => { process.exit(1) });
  } else {
    logger.error(e.message);
  }
}

const mainJob = cron.schedule("*/10 * * * * *", () => {
  logger.info("Starting main job.");
  healthCheck();
});
