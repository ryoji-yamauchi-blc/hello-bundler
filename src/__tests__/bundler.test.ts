import { getAllDependencies } from "../graph";
import { bundle } from "../bundler";

const entryFileName = "src/__tests__/target/basic/entry.js";

describe("bundler", () => {
  test("想定どおりのバンドル結果になること", () => {
    const allFiles = getAllDependencies(entryFileName);
    const bundled = bundle(allFiles);

    expect(bundled).toEqual(
      `const baz$4 = () => {
  console.log("im baz");
};
const bar$3 = () => {
  baz$4();
  console.log("im baz");
};
const foo$2 = () => {
  console.log("im foo");
};
foo$2();
bar$3();`
    );
  });
});
