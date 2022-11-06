// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { exec } from 'child_process';

/**
 * Execute simple shell command (async wrapper).
 * @param {String} cmd
 * @return {Object} { stdout: String, stderr: String }
 */
async function sh(cmd: string) {
	return new Promise(function (resolve, reject) {
		exec(cmd, (err, stdout, stderr) => {
			if (err) {
				reject(err);
			} else {
				resolve({ stdout, stderr });
			}
		});
	});
}

const EXTENSION_ID: string = 'undefined_publisher.autopr';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "autopr" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('autopr.autopr', () => {
		let folders: readonly vscode.WorkspaceFolder[] | undefined = vscode.workspace.workspaceFolders;
		if (!folders) { 
			return; 
		}
		let path = vscode.extensions.getExtension(EXTENSION_ID)?.extensionPath;
		let workspacePath = folders[0].uri.path;
		const getCommand = (value: string|undefined) => 'sh ' + path + '/src/push ' + '"' + (workspacePath) + '" "' + (value ?? 'Adding') + '"';
		vscode.window.showInputBox({
			"placeHolder": "Adding",
			"title": "Enter commit message"
		}).then((value) => {
			sh(getCommand(value)).then((value) => {
				console.log(value);
			});
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
