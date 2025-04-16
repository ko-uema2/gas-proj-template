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
# ExportHandlers.ts ドキュメント

## 概要

`exportHandlers.ts` ファイルは、TypeScript のソースファイルからエクスポートされているエンティティの名前を特定し、収集する役割を担っています。このファイルでは、**ポリシーパターン**を使用して、異なる種類のエクスポートを処理するロジックをモジュール化し、コードの拡張性と保守性を向上させています。

## 主なコンポーネント

### 1. **ExportHandler インターフェース**

`ExportHandler` インターフェースは、すべてのエクスポートハンドラーが実装すべき契約を定義します。各ハンドラーは以下のメソッドを実装する必要があります：

- `canHandle(node: ts.Node): boolean`: 指定されたノードを処理できるかどうかを判定します。
- `extractExportedNames(node: ts.Node, exportedFunctionNames: string[]): void`: ノードを処理し、エクスポートされた名前を指定された配列に追加します。

### 2. **ハンドラー**

#### a. ExportDeclarationHandler

`export { ... }` 宣言を処理します。

- **`canHandle`**: ノードが `ExportDeclaration` であるかを判定します。
- **`extractExportedNames`**: `ExportSpecifier` ノードからエクスポートされたエンティティの名前を抽出します。

#### b. VariableStatementHandler

`export const ...` または `export let ...` 宣言を処理します。

- **`canHandle`**: ノードが `VariableStatement` であり、`export` キーワードを含むかを判定します。
- **`extractExportedNames`**: `VariableDeclaration` ノードからエクスポートされた変数の名前を抽出します。

#### c. FunctionDeclarationHandler

`export function ...` 宣言を処理します。

- **`canHandle`**: ノードが `FunctionDeclaration` であり、`export` キーワードを含むかを判定します。
- **`extractExportedNames`**: エクスポートされた関数の名前を抽出します。

### 3. **ハンドラー配列**

すべてのハンドラー（`ExportDeclarationHandler`, `VariableStatementHandler`, `FunctionDeclarationHandler`）を含む配列が定義されています。この配列を反復処理して、各ノードに適したハンドラーを見つけます。

### 4. **collectExportedFunctionNames 関数**

この関数は、TypeScript の `SourceFile` を処理して、すべてのエクスポートされたエンティティの名前を収集します。

- ソースファイル内のすべてのノードを反復処理します。
- `handlers` 配列を使用して、各ノードに適したハンドラーを見つけます。
- エクスポートされたエンティティの名前を配列に収集します。

### 5. **includesExportKeywordModifier 関数**

ノードに `export` キーワード修飾子が含まれているかを確認するユーティリティ関数です。

- `ts.getModifiers` を使用してノードの修飾子を取得します。
- `export` キーワードが見つかった場合に `true` を返します。

## 使用例

```typescript
import { collectExportedFunctionNames } from "./exportHandlers";
import ts from "typescript";

const program = ts.createProgram(["src/index.ts"], {});
const sourceFile = program.getSourceFile("src/index.ts");

if (sourceFile) {
  const exportedNames = collectExportedFunctionNames(sourceFile);
  console.log(exportedNames);
}
```

## 設計の利点

- **モジュール性**: 各種類のエクスポートは専用のクラスで処理されます。
- **拡張性**: 新しい種類のエクスポートをサポートするために、新しいハンドラークラスを追加できます。
- **保守性**: エクスポート処理のロジックが他のコードから分離されています。
