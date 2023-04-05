import { parse } from "../parser";
import { ModuleIdIssuer } from "../ModuleIdIssuer";

describe("parser", () => {
  test("パース", () => {
    const moduleIdIssuer = new ModuleIdIssuer();

    const code = `
    import { foo } from './foo'
    import { bar } from './bar'
    `;

    const { dependencies } = parse(moduleIdIssuer, code);
    expect(dependencies).toEqual([
      {
        id: 2,
        path: "foo.js",
        importedNames: new Map([["foo", 2]]),
      },
      {
        id: 3,
        path: "bar.js",
        importedNames: new Map([["bar", 3]]),
      },
    ]);
  });
});
