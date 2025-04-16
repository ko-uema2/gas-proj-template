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
import ts from "typescript";

/**
 * Interface defining the contract for export handlers.
 * Each handler determines if it can process a node and extracts exported names.
 */
interface ExportHandler {
	/**
	 * Determines if the handler can process the given node.
	 * @param node - The TypeScript node to check.
	 * @returns True if the handler can process the node, otherwise false.
	 */
	canHandle(node: ts.Node): boolean;

	/**
	 * Extracts exported names from the given node.
	 * @param node - The TypeScript node to process.
	 * @param exportedFunctionNames - The array to store exported names.
	 */
	extractExportedNames(node: ts.Node, exportedFunctionNames: string[]): void;
}

/**
 * Handles `export { ... }` declarations.
 */
class ExportDeclarationHandler implements ExportHandler {
	canHandle(node: ts.Node): boolean {
		return ts.isExportDeclaration(node);
	}

	extractExportedNames(node: ts.Node, exportedFunctionNames: string[]): void {
		node.forEachChild((child) => {
			if (ts.isNamedExports(child)) {
				child.forEachChild((exportSpecifier) => {
					if (
						ts.isExportSpecifier(exportSpecifier) &&
						ts.isIdentifier(exportSpecifier.name)
					) {
						exportedFunctionNames.push(ts.idText(exportSpecifier.name));
					}
				});
			}
		});
	}
}

/**
 * Handles `export const ...` or `export let ...` declarations.
 */
class VariableStatementHandler implements ExportHandler {
	canHandle(node: ts.Node): boolean {
		return ts.isVariableStatement(node) && includesExportKeywordModifier(node);
	}

	extractExportedNames(node: ts.Node, exportedFunctionNames: string[]): void {
		node.forEachChild((child) => {
			if (ts.isVariableDeclarationList(child)) {
				child.forEachChild((declaration) => {
					if (ts.isVariableDeclaration(declaration)) {
						declaration.forEachChild((identifier) => {
							if (ts.isIdentifier(identifier)) {
								exportedFunctionNames.push(ts.idText(identifier));
							}
						});
					}
				});
			}
		});
	}
}

/**
 * Handles `export function ...` declarations.
 */
class FunctionDeclarationHandler implements ExportHandler {
	canHandle(node: ts.Node): boolean {
		return (
			ts.isFunctionDeclaration(node) && includesExportKeywordModifier(node)
		);
	}

	extractExportedNames(node: ts.Node, exportedFunctionNames: string[]): void {
		if (ts.isFunctionDeclaration(node) && node.name) {
			exportedFunctionNames.push(ts.idText(node.name));
		}
	}
}

/**
 * Array of all export handlers.
 * Each handler is responsible for processing a specific type of export.
 */

/**
 * NOTE: To add support for new types of exports in the future:
 * 1. Create a new class implementing the `ExportHandler` interface.
 * 2. Implement the `canHandle` method to identify the new export type.
 * 3. Implement the `extractExportedNames` method to extract the names of the new export type.
 * 4. Add the new handler to the `handlers` array below.
 */
const handlers: ExportHandler[] = [
	new ExportDeclarationHandler(),
	new VariableStatementHandler(),
	new FunctionDeclarationHandler(),
];

/**
 * Collects the names of all exported entities from a TypeScript source file.
 * @param sourceFile - The TypeScript source file to process.
 * @returns An array of exported entity names.
 */
export function collectExportedFunctionNames(
	sourceFile: ts.SourceFile,
): string[] {
	const exportedFunctionNames: string[] = [];

	sourceFile.forEachChild((node) => {
		for (const handler of handlers) {
			if (handler.canHandle(node)) {
				handler.extractExportedNames(node, exportedFunctionNames);
			}
		}
	});

	return exportedFunctionNames;
}

/**
 * Checks if a node has the `export` keyword modifier.
 * @param node - The TypeScript node to check.
 * @returns True if the node has the `export` keyword, otherwise false.
 */
function includesExportKeywordModifier(node: ts.Node): boolean {
	const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : null;
	if (!modifiers) return false;

	return modifiers.some(
		(modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
	);
}
