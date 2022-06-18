import Queue, { Job } from "bull";
import dotenv from "dotenv";
dotenv.config();

import { PreCheckError, preCheck } from "./core/pre-check";
import { logger } from "./shared/logger";
import { healthCheck } from "./modules/health-check/health-check";

try {
  preCheck();
} catch (e: any) {
  if (e instanceof PreCheckError) {
    logger.error(e.message);
    logger.warn("Exiting program.");
    process.exit(1);
  }
}

const healthCheckQueue = new Queue(
  "Health Check queue",
  `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
);

healthCheckQueue.on("error", (error) => {
  if (error.message.includes("ECONNREFUSED")) {
    logger.error(
      `Unable to connect to the REDIS server at => redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    );
    logger.warn("Exiting program.");
    process.exit(1);
  }
});

healthCheckQueue.add(
  {},
  {
    repeat: {
      cron: "*/10 * * * * *",
    },
  }
);

healthCheckQueue.process(async (job: Job) => {
  healthCheck();
});
