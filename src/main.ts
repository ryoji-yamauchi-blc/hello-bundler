import { writeFileSync } from "fs";
import { getAllDependencies } from "./graph";
import { bundle } from "./bundler";

const main = () => {
  const entryFileName = process.argv[2] as string;
  if (!entryFileName)
    throw new Error("エントリーポイントとなるファイル名を指定してね。");
  const allFiles = getAllDependencies(entryFileName);
  const bundled = bundle(allFiles);
  writeFileSync("bundled.js", bundled, "utf8");
};

main();
