import { getAllDependencies } from "../graph";
import { bundle } from "../bundler";

const entryFileName = "src/__tests__/target/basic/entry.js";

describe("bundler", () => {
  test("foo", () => {
    const allFiles = getAllDependencies(entryFileName);
    const bundled = bundle(allFiles);
    console.log(bundled);
  });
});
