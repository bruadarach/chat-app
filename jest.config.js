export default {
  verbose: true,
  collectCoverage: true,
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testEnvironment: "node",
};
