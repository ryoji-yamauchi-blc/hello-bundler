import { getAllDependencies } from "../graph";
import { bundle } from "../bundler";

describe("bundler", () => {
  test("シンプルなパターン", () => {
    const entryFileName = "src/__tests__/target/basic/entry.js";
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

  test("node_modulesに依存する場合", () => {
    const entryFileName = "src/__tests__/target/nodeModules/entry.js";
    const nodeModulePath = "src/__tests__/target/nodeModules/node_modules";
    const allFiles = getAllDependencies(entryFileName, nodeModulePath);
    const bundled = bundle(allFiles);

    expect(bundled).toEqual(
      `const baz$3 = () => {
  console.log('hello im baz');
};
const foo$2 = () => {
  console.log("im foo");
};
foo$2();
baz$3();`
    );
  });
});
