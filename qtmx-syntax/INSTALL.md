# Installation Guide

## VS Code (Windows/Mac/Linux)

1. Go to Extensions folder:
   - Windows: `%APPDATA%\Code\User\extensions`
   - Mac: `~/.vscode/extensions`
   - Linux: `~/.vscode/extensions`

2. Create folder: `qtmx-syntax-1.0.0`

3. Copy these files:
   - syntax-rules.json
   - theme-colors.json
   - language-config.json
   - package.json (see below)

4. Create `package.json`:

```json
{
  "name": "qtmx-syntax",
  "version": "1.0.0",
  "contributes": {
    "languages": [{
      "id": "qtmx",
      "aliases": ["QTMX-"],
      "extensions": [".qtmx-", ".qtmx+", ".qtmx#"]
    }]
  }
}
