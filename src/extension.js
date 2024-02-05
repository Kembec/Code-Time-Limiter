const vscode = require("vscode");

let timeoutID;
let warningTimeoutID;
let diagnosticCollection;
let statusBar;
let active = false;
let timerExpired = false;

function activate(context) {
	diagnosticCollection = vscode.languages.createDiagnosticCollection("codeTimeLimiter");

	statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	statusBar.command = "codeTimeLimiter.toggleActivate";
	context.subscriptions.push(statusBar);
	updateStatusBar();
	statusBar.show();

	context.subscriptions.push(
		vscode.commands.registerCommand("codeTimeLimiter.toggleActivate", () => {
			active = !active;
			timerExpired = false; // Restablece la lógica
			if (timeoutID) {
				clearTimeout(timeoutID);
			}
			if (warningTimeoutID) {
				clearTimeout(warningTimeoutID);
			}
			vscode.workspace
				.getConfiguration()
				.update("codeTimeLimiter.enableAtStartup", active, vscode.ConfigurationTarget.Global);
			updateStatusBar();
			if (active) {
				setUserTimeLimit();
			} else {
				deactivateFeature();
			}
		}),
	);

	vscode.workspace.onDidOpenTextDocument(
		(document) => {
			// Aplica errores a cualquier documento nuevo si el estado está activo y el temporizador ha expirado
			if (active && timerExpired) {
				applyLintErrorsToDocument(document);
			}
		},
		null,
		context.subscriptions,
	);
}

function setUserTimeLimit() {
	const now = new Date();
	let hours = Array.from({ length: 24 }, (_, i) => `${i}`.padStart(2, "0"));
	let minutes = Array.from({ length: 60 }, (_, i) => `${i}`.padStart(2, "0"));

	hours = hours.filter(
		(hour) =>
			parseInt(hour, 10) > now.getHours() ||
			(parseInt(hour, 10) === now.getHours() && now.getMinutes() < 59),
	);

	vscode.window.showQuickPick(hours, { placeHolder: "Select Hour" }).then((hour) => {
		if (!hour) {
			return;
		}

		if (parseInt(hour, 10) === now.getHours()) {
			minutes = minutes.filter((minute) => parseInt(minute, 10) > now.getMinutes());
		}

		vscode.window.showQuickPick(minutes, { placeHolder: "Select Minute" }).then((minute) => {
			if (!minute) {
				return;
			}

			const selectedTime = new Date();
			selectedTime.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);

			if (selectedTime < now) {
				selectedTime.setDate(selectedTime.getDate() + 1);
			}

			const duration = selectedTime.getTime() - now.getTime();

			if (duration > 300000) {
				warningTimeoutID = setTimeout(() => {
					vscode.window.showWarningMessage("5 minutes left before coding time ends.");
				}, duration - 300000);
			}

			if (timeoutID) {
				clearTimeout(timeoutID);
			}
			timeoutID = setTimeout(() => {
				timerExpired = true;
				applyLintErrorsToAllOpenEditors();
				vscode.window.showWarningMessage("Time to stop coding.");
				active = false;
				updateStatusBar();
			}, duration);

			active = true;
			timerExpired = false;
			updateStatusBar();
		});
	});
}

function applyLintErrorsToAllOpenEditors() {
	vscode.workspace.textDocuments.forEach(applyLintErrorsToDocument);
}

function applyLintErrorsToDocument(document) {
	const diagnostics = [];
	for (let line = 0; line < document.lineCount; line++) {
		const range = new vscode.Range(line, 0, line, document.lineAt(line).text.length);
		const diagnostic = new vscode.Diagnostic(
			range,
			`Coding time is over!`,
			vscode.DiagnosticSeverity.Error,
		);
		diagnostics.push(diagnostic);
	}
	diagnosticCollection.set(document.uri, diagnostics);
}

function deactivateFeature() {
	clearTimeout(timeoutID);
	diagnosticCollection.clear();
	vscode.window.showInformationMessage("Code Time Limiter has been deactivated.");
}

function updateStatusBar() {
	if (active) {
		statusBar.text = `$(clock) Code Time Limiter`;
		statusBar.tooltip = "Click to deactivate Code Time Limiter";
	} else {
		statusBar.text = `$(chrome-close) Code Time Limiter`;
		statusBar.tooltip = "Click to activate Code Time Limiter";
	}
}

function deactivate() {
	deactivateFeature();
	statusBar.dispose();
	diagnosticCollection.dispose();
}

module.exports = {
	activate,
	deactivate,
};
