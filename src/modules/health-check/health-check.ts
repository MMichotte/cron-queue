import { logger } from "../../shared/logger"

let count: number = 0

const healthCheck = (): void => {
  count += 1
  logger.info(`Health check n° ${count}`)
}

export {
  healthCheck
}