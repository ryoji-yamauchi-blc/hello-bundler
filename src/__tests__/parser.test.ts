import { parse } from "../parser";
import { ModuleIdIssuer } from "../ModuleIdIssuer";

describe("parser", () => {
  test("パース", () => {
    const moduleIdIssuer = new ModuleIdIssuer();

    const code = `
    import { foo } from './foo'
    import { bar } from './bar'
    import { baz } from 'baz'
    `;

    const { dependencies } = parse(moduleIdIssuer, code);
    expect(dependencies).toEqual([
      {
        id: 2,
        path: "foo.js",
        isNodeModule: false,
      },
      {
        id: 3,
        path: "bar.js",
        isNodeModule: false,
      },
      {
        id: 4,
        path: "node_modules/baz",
        isNodeModule: true,
      },
    ]);
  });
});
