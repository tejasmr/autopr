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

const EXTENSION_ID: string = 'tejasmr.autopr';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('autopr.autopr', () => {
		console.log("Retrieving the workspace folders");
		let folders: readonly vscode.WorkspaceFolder[] | undefined = vscode.workspace.workspaceFolders;

		if (!folders) { 
			console.log("Error: Workspace folders not found");
			return; 
		}

		console.log("Retrieving the path of the extension");
		let path = vscode.extensions.getExtension(EXTENSION_ID)?.extensionPath;

		console.log("Retrieving the default workspace");
		let workspacePath = folders[0].uri.path;

		console.log("Creating the command for the push script");
		const getCommand = (value: string|undefined) => 'sh ' + path + '/push ' + '"' + (workspacePath) + '" "' + (value ?? 'Adding') + '"';

		console.log("Showing the user the input box for the commit message");
		vscode.window.showInputBox({
			"placeHolder": "Adding",
			"title": "Enter commit message"
		}).then((value) => {
			console.log("Successfully retrieved the commit message from the user");
			sh(getCommand(value)).then((value) => {
				console.log("Successfully ran the script");
				console.log(value);
				console.log("Showing the user the notification");
				vscode.window.showInformationMessage("Successfully completed autopr! Cheers!");
			});
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
