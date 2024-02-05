const assert = require("assert");
const vscode = require("vscode");
const sinon = require("sinon");
const { activate, deactivate } = require("../src/extension");

suite("Extension Test Suite", () => {
	let sandbox;
	let fakeContext;

	setup(() => {
		sandbox = sinon.createSandbox();
		fakeContext = { subscriptions: [] };

		vscode.commands.getCommands(true).then((commands) => {
			if (commands.includes("codeTimeLimiter.toggleActivate")) {
				vscode.commands.unregisterCommand("codeTimeLimiter.toggleActivate");
			}
		});
	});

	teardown(() => {
		sandbox.restore();
	});

	test("Extension activates correctly", async () => {
		sandbox.stub(vscode.languages, "createDiagnosticCollection").returns({
			clear: sandbox.stub(),
			dispose: sandbox.stub(),
			set: sandbox.stub(),
		});

		sandbox.stub(vscode.window, "createStatusBarItem").returns({
			show: sandbox.stub(),
			hide: sandbox.stub(),
			dispose: sandbox.stub(),
			text: "",
			tooltip: "",
		});

		let commandRegistered = false;
		sandbox.stub(vscode.commands, "registerCommand").callsFake(() => {
			commandRegistered = true;
		});

		sandbox.stub(vscode.workspace, "onDidOpenTextDocument");

		await activate(fakeContext);

		assert.strictEqual(commandRegistered, true);
		assert.strictEqual(fakeContext.subscriptions.length > 0, true);
	});

	test("Extension deactivates correctly", () => {
		sandbox.stub(vscode.window, "showInformationMessage");

		deactivate();

		assert(
			vscode.window.showInformationMessage.calledWith("Code Time Limiter has been deactivated."),
		);
	});
});
