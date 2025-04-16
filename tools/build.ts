/**
 * Copyright 2025 ko-uema2
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import fs from "node:fs";
import { build } from "esbuild";
import ts from "typescript";
import { collectExportedFunctionNames } from "./exportHandlers.ts";

const ENTRY_POINT = "src/index.ts";
const globalName = "_entry";

if (!fs.existsSync(ENTRY_POINT)) {
	console.error(`Error: Entry point file not found: ${ENTRY_POINT}`);
	process.exit(1);
}

const program = ts.createProgram([ENTRY_POINT], {});
const sourceFile = program.getSourceFile(ENTRY_POINT);

const exportedFunctionNames = sourceFile
	? collectExportedFunctionNames(sourceFile)
	: [];

console.log("Exported function names:", exportedFunctionNames);
console.log("Building with esbuild...");

build({
	entryPoints: [ENTRY_POINT],
	format: "iife",
	bundle: true,
	outdir: "dist",
	target: "es2020",
	globalName,
	banner: {
		js: `
${exportedFunctionNames
	.map((functionName) =>
		`
function ${functionName} () {
  return ${globalName}.${functionName}(...arguments);
};
`.trim(),
	)
	.join("\n")}
`.trim(),
	},
}).catch((error) => {
	console.error("Build failed:", error);
	process.exit(1);
});
