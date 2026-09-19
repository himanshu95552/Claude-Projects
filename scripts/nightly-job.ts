import "./load-env";
import { runNightlyJob } from "../src/domain/nightly-job";

// CLI entrypoint: `npm run nightly-job` or `tsx scripts/nightly-job.ts [YYYY-MM-DD]`
const dateArg = process.argv[2];
const forDate = dateArg ? new Date(dateArg) : undefined;

runNightlyJob(forDate)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
