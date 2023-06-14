# 25 分でつくるモジュールバンドラ

## バンドラーをビルドする

```
npm install
npm run build // dist配下に生成されます
```

## バンドラーを使ってみる

```
// entry.jsをバンドルして、bundled.jsを生成する
node dist/main.js  src/__tests__/target/basic/entry.js
```
