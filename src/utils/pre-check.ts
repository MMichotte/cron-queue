class PreCheckError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PreCheckError";
  }
}

const REQUIRED_ENV_VARS = [
  "LOG_LEVEL",
  "LOG_FILE",
  "REDIS_HOST",
  "REDIS_PORT"
];

const envCheck = (): void => {
  /**
   * Check that all environment variables are present.
   */
  const errors: string[] = [];

  REQUIRED_ENV_VARS.forEach((envVar: string) => {
    if (!process.env[envVar]) errors.push(envVar);
  });

  if (errors.length > 0) {
    throw new PreCheckError(
      `Missing following environment variable(s): ${errors.join(", ")}`
    );
  }
};

const preCheck = (): void => {
  /**
   * Make various of pre-checks to ensure all the necessary services
   * are available before proceeding to starting the worker.
   */

  envCheck();
};

export { PreCheckError, preCheck };
