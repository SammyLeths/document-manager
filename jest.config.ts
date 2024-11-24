import "ts-node/register";

export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [
    "C:/Users/soeyi/Interviews/peninsula/file-browser/src/setupTests.ts",
  ],
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
  },
};
