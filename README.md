<!--
Copyright 2025 ko-uema2

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->
# コンテナに GAS + Typescript + clasp + Jest の環境を構築する

## このテンプレートでできること

このテンプレートを利用することで、以下のことができるようになります。

## 前提

- ホストOS の CPU アーキテクチャが arm64 であること
  - Apple Silicon Mac など (作者は M3 MacBook Air を使用)
- ホストOS に Docker Desktop がインストールされていること
- ホストOS に VSCode がインストールされていること
- ホストOS の VSCode に Dev Containers 拡張機能がインストールされていること
- ホストOS に Git がインストールされていること
- 自身の GitHub アカウントを持っていること
- 自身の Google アカウントを持っていること
- Google アカウントで Google Apps Script API が有効化されていること
  - [Google Apps Script APIを有効にする](https://zenn.dev/cordelia/articles/3107aaf8b7a3d6#google-apps-script-api%E3%82%92%E6%9C%89%E5%8A%B9%E3%81%AB%E3%81%99%E3%82%8B)

## 構築手順

1. 本リポジトリ右上の `Use this template` ボタンをクリックして、自分の GitHub 上にリポジトリを作成します。  
    今回は `Create a new repository` を選択します。

    ![](./doc/img/CleanShot%202025-04-19%20at%2005.35.15.png)

    リポジトリを作成すると、`generated from ko-uema2/gas-proj-template` という補足がついていることを確認してください。

    ![](./doc/img/CleanShot%202025-04-19%20at%2005.39.49.png)

1. テンプレートから作成したリポジトリをローカルにクローンします。  
    任意のディレクトリに移動して、以下のコマンドを実行します。

    ```bash
    git clone <your-repo-url>
    ```

1. Docker Desktop を起動します。

1. VSCode で、先程クローンしたリポジトリを開きます。

1. コンテナを起動します。  
    `shift + cmd + P` を押して、コマンドパレットを開いた後、`Dev Containers: Reopen in Container` を選択します。

    ![](./doc/img/CleanShot%202025-04-19%20at%2006.13.30.png)

    コンテナのビルドが始まります。  
    ビルドが完了すると、下記画像のように VSCode がコンテナ内で開かれます。

    ![](./doc/img/CleanShot%202025-04-19%20at%2006.38.35.png)

1. 本プロジェクト用に Google Apps Script のプロジェクトを作成します。

    1. Google ドライブの任意の場所に、プロジェクト用のフォルダを作成します。  
    1. 作成したフォルダを開き、左上の `+ 新規` ボタンから`Google Apps Script` を選択します。

    ```bash
    <任意のディレクトリ>
    └── <プロジェクトのフォルダ>      # i. フォルダを作成
        └── Apps Script ファイル    # ⅱ. Google Apps Script のファイルを作成
    ```

1. 上記で作成したフォルダ・ファイルの ID を取得します。  
    Google ドライブの URL を開き、以下の \<parent-id\> と \<script-id\> に該当する ID をコピーします。

    ```bash
    https://drive.google.com/drive/folders/<parent-id>
    ```

    ```bash
    https://script.google.com/home/projects/<script-id>/edit
    ```

1. `.clasp.json` を作成します。  
    `.clasp.json.example` を `.clasp-dev.json` にリネームして、先ほど控えた ID 2種類を以下のように転記します。

    ```json
    {
      "scriptId": "<script-id>",
      "rootDir": "./src",
      "parentId": "<parent-id>"
    }
    ```

    > 開発環境と本番環境とで Google Apps Script のプロジェクトを分けたい場合は、`.clasp.json.example` を `.clasp-prod.json` にリネームして、`.clasp-dev.json` と同様に ID を転記してください。

1. Google 認証を行います。  
    コンテナ内のターミナルで以下のコマンドを実行します。

    ```bash
    clasp login
    ```

    ブラウザが立ち上がるので、Google アカウントでログインします。  
    認証が完了すると、コンテナ内のターミナルに以下のようなメッセージが表示されます。

    ```bash
    You are now logged in as <your-email>
    ```

**以上で、環境構築は完了です。これで、Google Apps Script の開発を始める準備が整いました.**
