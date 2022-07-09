import path from "path";
import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config();

import { PreCheckError, preCheck } from "./utils/pre-check";
import { logger } from "./utils/logger";
import { healthCheck } from "./modules/health-check/health-check";
import * as csvHandler from "./utils/csv-handler";
import { Grade } from "./models/grade"

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

const mainJob = cron.schedule("*/10 * * * * *", async () => {
  logger.info("Starting main job.");
  const grades = await csvHandler.csvToObjectArray(path.resolve(__dirname,"../data/grades.csv"), Grade);
  healthCheck();
});
