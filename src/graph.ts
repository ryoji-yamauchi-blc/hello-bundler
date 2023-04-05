import path from "path";
import { readFileSync } from "fs";
import { parse } from "./parser";
import { DependenciesGraph } from "@/types";
import { ModuleIdIssuer } from "./ModuleIdIssuer";

type Queue = {
  path: string;
  id: number;
  isNodeModule: boolean;
};

export const getAllDependencies = (
  entryFileName: string,
  nodeModulePath = "node_modules"
) => {
  const moduleIdIssuer = new ModuleIdIssuer();
  const queue: Queue[] = [
    { path: entryFileName, id: moduleIdIssuer.get(), isNodeModule: false },
  ];
  const graph: DependenciesGraph = [];

  while (queue.length) {
    const target = queue.shift() as Queue;
    const code = readFile(target);
    const dirname = path.dirname(target.path);

    const { ast, dependencies, allImportedNamesMap } = parse(
      moduleIdIssuer,
      code,
      dirname,
      nodeModulePath
    );

    graph.push({
      id: target.id,
      path: target.path,
      ast,
      dependencies,
      allImportedNames: allImportedNamesMap,
    });

    queue.push(...dependencies.map((d) => d));
  }

  return graph;
};

const readFile = (q: Queue) => {
  if (!q.isNodeModule) {
    return readFileSync(q.path, "utf8");
  }

  // node_modulesの場合、package.jsonからentryとなるファイルを読み込む
  const packageJsonPath = path.join(q.path, "package.json");
  const packageJson = readFileSync(packageJsonPath, "utf8");
  const { main } = JSON.parse(packageJson);
  const entryPath = main || "main.js";
  return readFileSync(path.join(q.path, entryPath), "utf8");
};
