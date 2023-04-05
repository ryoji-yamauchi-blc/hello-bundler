import path from "path";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import { Module, ImportedNames } from "@/types";
import { ModuleIdIssuer } from "./ModuleIdIssuer";

/**
 * 対象ソースコードのAST変換および、依存するモジュールの情報を返却する。
 * playground
 * https://astexplorer.net/
 * @param code
 */
export const parse = (
  moduleIdIssuer: ModuleIdIssuer,
  code: string,
  basePath = ""
) => {
  const dependencies: Module[] = [];
  const allImportedNames: ImportedNames[] = [];

  const ast = parser.parse(code, {
    sourceType: "module",
  });

  traverse(ast, {
    /**
     * import分からimport時の名前と、モジュール名を取得する。
     * @param nodePath
     */
    ImportDeclaration(nodePath) {
      const { node } = nodePath;
      const modulePath = node.source.value as string;
      // 相対パスから絶対パスに変換する
      // モジュールのパスは、パース対象のファイルを基準とした相対パスになっているので。
      const absoluteModulePath = `${path.join(basePath, modulePath)}.js`;

      const dependenciesModuleId =
        moduleIdIssuer.nextIdentity(absoluteModulePath);

      const importedName = node.specifiers
        .map((s) => {
          if (
            s.type === "ImportSpecifier" &&
            s.imported.type === "Identifier"
          ) {
            return s.imported.name;
          }
        })
        .filter((v) => !!v) as string[];

      const importedNames = new Map(
        importedName.map((v) => [v, dependenciesModuleId])
      );

      dependencies.push({
        id: dependenciesModuleId,
        path: absoluteModulePath,
        importedNames,
      });
      allImportedNames.push(importedNames);
    },
  });

  const allImportedNamesMap = allImportedNames.reduce((acc, item) => {
    return new Map([...acc, ...item]);
  }, new Map() as ImportedNames);

  return { ast, dependencies, allImportedNamesMap };
};
