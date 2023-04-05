/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // tsconfigのエイリアスを参照してくれなかった気がするので、別途定義
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // __tests__配下のテスト用のバンドル対象のコードはテスト対象外にする
  testPathIgnorePatterns: ["<rootDir>/src/__tests__/target/"],
};
