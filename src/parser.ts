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
  basePath = "",
  nodeModulePath = "node_modules"
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

      const absoluteModulePath = toFixPath(
        modulePath,
        basePath,
        nodeModulePath
      );

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

      dependencies.push({
        id: dependenciesModuleId,
        path: absoluteModulePath,
        isNodeModule: isNodeModule(modulePath),
      });

      const importedNames = new Map(
        importedName.map((v) => [v, dependenciesModuleId])
      );

      allImportedNames.push(importedNames);
    },
  });

  const allImportedNamesMap = allImportedNames.reduce((acc, item) => {
    return new Map([...acc, ...item]);
  }, new Map() as ImportedNames);

  return { ast, dependencies, allImportedNamesMap };
};

const isNodeModule = (modulePath: string) => {
  // 相対パス以外はnode_modulesと判断する
  return modulePath[0] !== ".";
};

/**
 * モジュールのパスを、entryポイントからの相対パスへ変換する。
 * node_modulesの場合は、node_modules/moduleのパスに変換する。
 * @param modulePath
 * @param basePath
 */
const toFixPath = (
  modulePath: string,
  basePath: string,
  nodeModulePath: string
) => {
  // 内部モジュール
  if (!isNodeModule(modulePath)) {
    return `${path.join(basePath, modulePath)}.js`;
  }

  // 外部モジュール(eg node_modules)
  return path.join(nodeModulePath, modulePath);
};
