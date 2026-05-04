const vscode = require('vscode');

let lastUsedAction = 'saveAll';
let autoSaveEnabled = false;
let isDirty = false;

let killAllButton;
let toggleTerminalButton;

const KILL_ALL_PRIORITY = -999999;
const TOGGLE_TERMINAL_PRIORITY = -999998;

function activate(context) {
    console.log('AutoSaveToggler is now active!');

    let saveAllDisposable = vscode.commands.registerCommand('auto-save-toggler.saveAll', function () {
        vscode.commands.executeCommand('workbench.action.files.saveAll');
        updateDynamicAction('saveAll');
    });

    let saveAllDirtyDisposable = vscode.commands.registerCommand('auto-save-toggler.saveAllDirty', function () {
        vscode.commands.executeCommand('workbench.action.files.saveAll');
        updateDirtyStatus();
    });

    let saveAllCleanDisposable = vscode.commands.registerCommand('auto-save-toggler.saveAllClean', function () {
        vscode.commands.executeCommand('workbench.action.files.saveAll');
        updateDirtyStatus();
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
        saveAllDirtyDisposable,
        saveAllCleanDisposable,
        toggleAutoSaveDisposable,
        dynamicActionSaveAllDisposable,
        dynamicActionToggleAutoSaveDisposable,
        toggleAutoSaveOnDisposable,
        toggleAutoSaveOffDisposable
    );

    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('AutoSaveToggler.config') || event.affectsConfiguration('files.autoSave')) {
            updateAutoSaveStatus();
            updateDirtyStatus();
            refreshStatusBarButtons();
        }
    });

    vscode.workspace.onDidChangeTextDocument(() => {
        updateDirtyStatus();
    });

    updateAutoSaveStatus();
    updateDirtyStatus();
    refreshStatusBarButtons();
}

function refreshStatusBarButtons() {
    const config = vscode.workspace.getConfiguration('AutoSaveToggler').get('config') || {};

    if (killAllButton) { killAllButton.dispose(); killAllButton = undefined; }
    if (toggleTerminalButton) { toggleTerminalButton.dispose(); toggleTerminalButton = undefined; }

    if (config.killAllTasks !== false) {
        killAllButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, KILL_ALL_PRIORITY);
        killAllButton.text = '$(trash)';
        killAllButton.tooltip = 'Kill All Tasks';
        killAllButton.command = 'workbench.action.terminal.killAll';
        killAllButton.show();
    }

    if (config.toggleTerminal !== false) {
        toggleTerminalButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, TOGGLE_TERMINAL_PRIORITY);
        toggleTerminalButton.text = '$(terminal-cmd)';
        toggleTerminalButton.tooltip = 'Toggle Terminal';
        toggleTerminalButton.command = 'workbench.action.togglePanel';
        toggleTerminalButton.show();
    }
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
    vscode.commands.executeCommand('setContext', 'AutoSaveToggler.isDirty', isDirty && !autoSaveEnabled);
}

function updateAutoSaveStatus() {
    const autoSave = vscode.workspace.getConfiguration('files').get('autoSave');
    autoSaveEnabled = autoSave !== 'off';
    updateContexts();
}

function updateDirtyStatus() {
    isDirty = vscode.workspace.textDocuments.some(doc => doc.isDirty);
    updateContexts();
}

function deactivate() {
    if (killAllButton) { killAllButton.dispose(); }
    if (toggleTerminalButton) { toggleTerminalButton.dispose(); }
}

module.exports = {
    activate,
    deactivate
};
