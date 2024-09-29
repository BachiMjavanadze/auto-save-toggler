![icon](icon.png)
## Auto Save Toggler

### Description

`Auto Save Toggler` is a [VSCode extension](https://marketplace.visualstudio.com/items?itemName=BachiMjavanadze.auto-save-toggler) that enhances your workflow by providing quick access to save functions directly from your editor toolbar. This extension helps you manage your auto-save preferences with ease.

### Features

- **Save All Button**: Quickly save all open files with a single click.
- **Toggle Auto Save Button**: Easily switch auto-save on or off.
- **Multiple Display Variants**: Choose between different display options to suit your preferences.

#### Default Configurations:

```json
{
  "AutoSaveToggler.config": {
    "isActive": true,
    "variant": 3
  }
}
```

### Usage

After installation, you'll see new buttons in your editor title bar. The appearance depends on your chosen variant:

1. **Variant 1 (Compact)**: A single dynamic button with a dropdown menu.

![full image](media/full.jpg)

<br>

2. **Variant 2 (Expanded)**: Two separate buttons for Save All and Toggle Auto Save.

![compact image](media/compact.jpg)

<br>

3. **Variant 3 (Single Toggle)**: A single button to toggle Auto Save on/off with changing icons.

![single image](media/single.jpg)

### Configuration

You can customize the extension's behavior in your VSCode settings:

```json
{
  "AutoSaveToggler.config": {
    "isActive": true,
    "variant": 1
  }
}
```

- `isActive`: Set to `true` to enable the extension, `false` to disable.
- `variant`: Choose the display variant (1 for compact, 2 for expanded, 3 for single toggle button).

### License

This extension is licensed under the [MIT License](LICENSE).
