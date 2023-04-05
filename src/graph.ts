import path from "path";
import { readFileSync } from "fs";
import { parse } from "./parser";
import { DependenciesGraph } from "@/types";
import { ModuleIdIssuer } from "./ModuleIdIssuer";

type Queue = {
  path: string;
  id: number;
};

export const getAllDependencies = (entryFileName: string) => {
  const moduleIdIssuer = new ModuleIdIssuer();
  const queue: Queue[] = [{ path: entryFileName, id: moduleIdIssuer.get() }];
  const graph: DependenciesGraph = [];

  while (queue.length) {
    const target = queue.shift() as Queue;
    const code = readFileSync(target.path, "utf8");
    const dirname = path.dirname(target.path);

    const { ast, dependencies, allImportedNamesMap } = parse(
      moduleIdIssuer,
      code,
      dirname
    );

    graph.push({
      id: target.id,
      path: target.path,
      ast,
      dependencies,
      allImportedNames: allImportedNamesMap,
    });

    queue.push(...dependencies.map((d) => ({ path: d.path, id: d.id })));
  }

  return graph;
};
