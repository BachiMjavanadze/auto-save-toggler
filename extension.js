const vscode = require('vscode');

let lastUsedAction = 'saveAll';
let autoSaveEnabled = false;

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

    let toggleAutoSaveOnDisposable = vscode.commands.registerCommand('auto-save-toggler.toggleAutoSaveOn', function () {
        vscode.workspace.getConfiguration('files').update('autoSave', 'afterDelay', true);
        updateAutoSaveStatus(true);
    });

    let toggleAutoSaveOffDisposable = vscode.commands.registerCommand('auto-save-toggler.toggleAutoSaveOff', function () {
        vscode.workspace.getConfiguration('files').update('autoSave', 'off', true);
        updateAutoSaveStatus(false);
    });

    context.subscriptions.push(
        saveAllDisposable,
        toggleAutoSaveDisposable,
        dynamicActionSaveAllDisposable,
        dynamicActionToggleAutoSaveDisposable,
        toggleAutoSaveOnDisposable,
        toggleAutoSaveOffDisposable
    );

    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('AutoSaveToggler.config') || event.affectsConfiguration('files.autoSave')) {
            updateContexts();
        }
    });

    updateAutoSaveStatus();
    updateContexts();
}

function updateDynamicAction(action) {
    lastUsedAction = action;
    vscode.commands.executeCommand('setContext', 'AutoSaveToggler.lastUsedAction', action);
}

function updateContexts() {
    const config = vscode.workspace.getConfiguration('AutoSaveToggler').get('config');
    vscode.commands.executeCommand('setContext', 'AutoSaveToggler.isActive', config.isActive);
    vscode.commands.executeCommand('setContext', 'AutoSaveToggler.variant', config.variant);
    vscode.commands.executeCommand('setContext', 'AutoSaveToggler.lastUsedAction', lastUsedAction);
    vscode.commands.executeCommand('setContext', 'AutoSaveToggler.autoSaveEnabled', autoSaveEnabled);
}

function updateAutoSaveStatus(forcedState) {
    if (forcedState !== undefined) {
        autoSaveEnabled = forcedState;
    } else {
        const autoSave = vscode.workspace.getConfiguration('files').get('autoSave');
        autoSaveEnabled = autoSave !== 'off';
    }
    updateContexts();
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};
