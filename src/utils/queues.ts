import Queue, { Job } from "bull";
import { healthCheck } from "../modules/health-check/health-check";
import { logger } from "./logger";

const delayedJobsQueue = new Queue(
  "Delayed Jobs Queue",
  `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
);

delayedJobsQueue.on("error", (error) => {
  if (error.message.includes("ECONNREFUSED")) {
    logger.error(
      `Unable to connect to the REDIS server at => redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      () => { process.exit(1) }
    );
  }
});

delayedJobsQueue.process(async (job: Job) => {
  logger.info("Processing delayed job");
  healthCheck();
});

export { delayedJobsQueue }