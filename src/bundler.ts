import { DependenciesGraph } from "@/types";
import * as t from "@babel/types";
import traverse from "@babel/traverse";
import generate from "@babel/generator";

export const bundle = (graph: DependenciesGraph) => {
  const output = [];

  for (const target of graph.reverse()) {
    transformer(target);
    const { code } = generate(target.ast);
    output.push(code);
  }

  return output.join("\n");
};

const transformer = (target: DependenciesGraph[0]) => {
  traverse(target.ast, {
    ImportDeclaration(nodePath) {
      nodePath.remove();
    },
    // export分をただの宣言に変換し、名前にモジュールIDを付与する
    // eg)
    //  before
    //  export const foo = () => {}
    //
    //  after
    //  const foo$1 = () => {}
    ExportDeclaration(nodePath) {
      if (nodePath.isExportNamedDeclaration()) {
        const declaration = nodePath.node.declaration as t.VariableDeclaration;

        declaration.declarations.forEach((d) => {
          if (d.id.type === "Identifier") {
            // export時に、自分のモジュールのIDをsuffixにつけたい
            d.id.name = addSuffix(d.id.name, target.id);
          }
        });
        nodePath.replaceWith(declaration);
      }
    },
    VariableDeclarator(nodePath) {
      // 参照している変数がimportしているモジュールのものであれば、import対象のモジュールIDをsuffixにつける
      if (nodePath.node.init?.type === "Identifier") {
        const name = nodePath.node.init.name;
        const importedModuleId = target.allImportedNames.get(name);
        if (importedModuleId) {
          nodePath.node.init.name = addSuffix(name, importedModuleId);
        }
      }
    },
    CallExpression(nodePath) {
      if (nodePath.node.callee.type === "Identifier") {
        const name = nodePath.node.callee.name;
        const importedModuleId = target.allImportedNames.get(name);
        if (importedModuleId) {
          nodePath.node.callee.name = addSuffix(name, importedModuleId);
        }
      }
    },
  });
};

const addSuffix = (name: string, id: number) => {
  return `${name}\$${id}`;
};
