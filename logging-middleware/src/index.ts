import { Log } from "./logger.ts";

const testLogger = async () => {
  try {
    const result = await Log(
      "backend",
      "info",
      "service",
      "logging middleware working successfully"
    );

    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

testLogger();