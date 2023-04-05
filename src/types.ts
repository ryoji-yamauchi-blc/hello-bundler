import parser from "@babel/parser";

type AST = ReturnType<typeof parser.parse>;

// モジュールをnamed importする際の名前
export type ImportedNames = Map<string, number>;

/**
 * モジュールを表現する
 */
export type Module = {
  // モジュールのID
  id: number;
  // モジュールの絶対パス
  path: string;
  // node_modulesに依存しているパッケージの場合true
  isNodeModule: boolean;
};

/**
 * モジュールAがどのモジュールに依存しているかを表現する
 */
export type DependenciesGraph = {
  // モジュールのID
  id: number;
  // モジュールの絶対パス
  path: string;
  // モジュールのAST
  ast: AST;
  // 依存しているモジュール
  dependencies: Module[];
  // モジュールをnamed importする際の名前
  allImportedNames: ImportedNames;
}[];
