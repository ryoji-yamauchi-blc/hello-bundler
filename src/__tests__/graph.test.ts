import { getAllDependencies } from "../graph";

describe("graph", () => {
  test("依存モジュール取得", () => {
    const entryFileName = "src/__tests__/target/basic/entry.js";
    const dependencies = getAllDependencies(entryFileName);
  });
});
