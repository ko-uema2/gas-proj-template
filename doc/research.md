
# 本環境を整備するために調査して実施した内容

1. Dockerfile を作成する

```dockerfile
FROM node:23-slim

# Set working directory
WORKDIR /usr/app

# Install clasp globally
RUN npm install -g @google/clasp

# Default command
CMD [ "bash" ]
```

1. docker-compose.yml を作成する

```yaml
services:
  gas:
    build: .
    container_name: gas-proj-template
    volumes:
      - ../:/usr/app
    working_dir: /usr/app
    tty: true
```

1. docker-compose を実行する

```bash
docker-compose up -d
```

1. 起動確認

```bash
docker container ls
```

1. clasp のインストール確認

```bash
docker container exec -it gas-proj-template bash
clasp -v
```

1. 認証情報を保存するファイルを作成する

認証情報がコンテナ内の `/root/.clasprc.json` に保存されることを踏まえて、`docker-compose.yml` にボリュームを追加する。

> これをやるとうまくいかなかった。。
> 今回は実施しない。

<!-- ```diff:yaml
services:
  gas:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - ../src:/usr/app
+      - ./.clasprc.json:/root/.clasprc.json
    working_dir: /usr/app
    tty: true
```

ボリュームをマウントする際に存在しないファイルを指定すると、ホスト側のファイルがコンテナ内にコピーされるので、事前に空の `.clasprc.json` を作成しておく。

```bash
touch .clasprc.json
```

1. コンテナを再起動

````bash
docker container rm -f docker-gas-1
docker-compose up -d
``` -->

1. clasp の認証

```bash
# `--no-localhost` オプションを指定することで、ブラウザが自動で開かないようにする。
clasp login --no-localhost
```

ターミナルに表示された URL をコピーして、ブラウザで開く。  
その後ブラウザで表示された URL をコピーして、ホスト側のターミナルに貼り付けて Enter を押す。

認証が完了したら、コンテナ内の `/root/.clasp.json` に認証情報が保存されていることを確認する。

```bash
cat /root/.clasprc.json
```

1. ASIDE の初期化

```bash
npx @google/aside init
```

自分の Google ドライブに Project Title で指定した名前のスプレッドシートが作成される。

```bash
Need to install the following packages:
@google/aside@1.4.4
Ok to proceed? (y) y

npm warn deprecated sourcemap-codec@1.4.8: Please use @jridgewell/sourcemap-codec instead
✔ Project Title: … gas-proj-template
✔ Create an Angular UI? … No / Yes
✔ Generate package.json? … No / Yes
✔ Adding scripts...
✔ Saving package.json...
✔ Installing dependencies...
✔ Installing src template...
✔ Installing test template...
✔ Script ID (optional): …
✔ Script ID for production environment (optional): …
✔ Creating gas-proj-template...

-> Google Sheets Link: Not found
-> Apps Script Link: Not found

Error: ENOENT: no such file or directory, lstat 'dist/.clasp.json'
```

1. `prettier` と `eslint`、`gts` のアンインストール

```bash
npm uninstall prettier eslint eslint-config-prettier eslint-plugin-prettier @typescript-eslint/eslint-plugin gts
```

1. `prettier`, `eslint`　関連の設定ファイルを削除する

```bash
rm -rf .editorconfig .prettierrc.json .prettierignore .eslintrc.json .eslintignore
```

1. `biome` のインストール

```bash
npm install -D @biomejs/biome
```

1. `biome` の初期化

```bash
npx @biomejs/biome init
```

1. `rollup` のアンインストール

```bash
npm uninstall rollup rollup-plugin-typescript2 rollup-plugin-cleanup rollup-plugin-license rollup-plugin-prettier
```

1. `rollup` 関連の設定ファイルを削除する

```bash
rm -rf rollup.config.mjs
```

1. `esbuild` の導入

```bash
npm install -D esbuild ts-node @types/node
```

1. `esbuild` でするためのスクリプトを作成する

`build.ts` を参照。

参考

[GAS + Typescript のいい感じのビルド環境を整える](https://zenn.dev/terass_dev/articles/a39ab8d0128eb1)

1. `build.ts` を実行する

```bash
npx ts-node -T ./tools/build.ts
```

`dist` ディレクトリに `index.js` が生成されていることを確認する。

1. `clasp` でデプロイする

```bash
clasp push
```

`dist` ディレクトリにある `index.js` が Google Drive 上のプロジェクトにアップロードされる。

1. `package.json` の修正

- node.jsにプロジェクトを ESModule として認識させるために、`package.json` に `"type": "module"` を追加する。  
- eslint のスクリプトを biome に置き換える。
- rollup のスクリプトを esbuild に置き換える。

```json:package.json
{
  "name": "gas-proj-template",
  "version": "0.0.0",
  "description": "",
  "main": "dist/index.js",
  "license": "Apache-2.0",
  "keywords": [],
  "type": "module",
  "scripts": {
    "clean": "rimraf build dist",
    "lint": "npm run license && biome check --write src/ test/",
    "bundle": "ts-node -T ./tools/build.ts",
    "build": "npm run clean && npm run bundle && ncp appsscript.json dist/appsscript.json",
    "license": "license-check-and-add add -f license-config.json",
    "test": "jest test/ --passWithNoTests --detectOpenHandles",
    "deploy:dev": "npm run lint && npm run test && npm run build && ncp .clasp-dev.json .clasp.json && clasp push -f",
    "deploy:prod": "npm run lint && npm run test && npm run build && ncp .clasp-prod.json .clasp.json && clasp push"
  },
```