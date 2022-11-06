import * as vscode from 'vscode';
import { exec } from 'child_process';

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

export function activate(context: vscode.ExtensionContext) {
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

export function deactivate() { }
