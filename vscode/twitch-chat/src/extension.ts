import * as vscode from 'vscode';
import * as tmi from 'tmi.js';

export function activate(context: vscode.ExtensionContext) {
	let config = vscode.workspace.getConfiguration('twitch');

	let client = new tmi.Client(
		{
			options: { debug: false, messagesLogLevel: "info" },
			connection: {
				reconnect: true,
				secure: true
			},
			identity: {
				username: config.username,
				password: config.oauth
			},
			channels: [config.username]
		}
	);
	client.on('message', (_channel, tags, message, _self) => {
		vscode.window.showInformationMessage(`${tags['display-name']}: ${message}`);
	});

	let disposable = vscode.commands.registerCommand('twitch.send-msg', async () => {
		let msg = await vscode.window.showInputBox({
			placeHolder: 'Type the message'
		});
		if (msg) {
			client.say(config.username, msg);
		}
	});
	context.subscriptions.push(disposable);

	client.connect();
}
