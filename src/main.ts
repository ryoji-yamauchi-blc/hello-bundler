export const run = () => {
  const entryPoint = process.argv[2] as string;
  if (!entryPoint) throw new Error("エントリーポイントを指定してね。");
};
