const vscode = require('vscode');

let lastUsedAction = 'saveAll';

function activate(context) {
    console.log('AutoSaveToggler is now active!');

    let saveAllDisposable = vscode.commands.registerCommand('auto-save-toggler.saveAll', function () {
        vscode.commands.executeCommand('workbench.action.files.saveAll');
        updateDynamicAction('saveAll');
    });

    let toggleAutoSaveDisposable = vscode.commands.registerCommand('auto-save-toggler.toggleAutoSave', function () {
        vscode.commands.executeCommand('workbench.action.toggleAutoSave');
        updateDynamicAction('toggleAutoSave');
    });

    let dynamicActionSaveAllDisposable = vscode.commands.registerCommand('auto-save-toggler.dynamicActionSaveAll', function () {
        vscode.commands.executeCommand('auto-save-toggler.saveAll');
    });

    let dynamicActionToggleAutoSaveDisposable = vscode.commands.registerCommand('auto-save-toggler.dynamicActionToggleAutoSave', function () {
        vscode.commands.executeCommand('auto-save-toggler.toggleAutoSave');
    });

    context.subscriptions.push(saveAllDisposable, toggleAutoSaveDisposable, dynamicActionSaveAllDisposable, dynamicActionToggleAutoSaveDisposable);

    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('AutoSaveToggler.config')) {
            updateContexts();
        }
    });

    updateContexts();
}

function updateDynamicAction(action) {
    lastUsedAction = action;
    vscode.commands.executeCommand('setContext', 'AutoSaveToggler.lastUsedAction', action);
}

function updateContexts() {
    const config = vscode.workspace.getConfiguration('AutoSaveToggler').get('config');
    vscode.commands.executeCommand('setContext', 'AutoSaveToggler.isActive', config.isActive);
    vscode.commands.executeCommand('setContext', 'AutoSaveToggler.compactView', config.compactView);
    vscode.commands.executeCommand('setContext', 'AutoSaveToggler.lastUsedAction', lastUsedAction);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};
