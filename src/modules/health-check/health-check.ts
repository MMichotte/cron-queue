import axios from "axios";
import { logger } from "../../utils/logger";
import { delayedJobsQueue } from "../../utils/queues";

let count: number = 0;

const healthCheck = (): void => {
  count += 1;
  axios
    .get("http://localhost:8081")
    .then((res) => {
      logger.info(`Performing Health check n° ${count}`);
    })
    .catch((err) => {
      if (err.response?.status === 429) {
        logger.warn("Delaying Job.");
        delayedJobsQueue.add(
          {},
          { delay: err.response.headers["retry-after"] * 1000 }
        );
      } else {
        console.log("Error: ", err.message);
      }
    });
};

export { healthCheck };
