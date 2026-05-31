# QTMX- Syntax Highlighting

Complete syntax highlighting for QTMX- Pure language.

## Installation

### VS Code

1. Copy `syntax-rules.json` to your VS Code extensions folder
2. Restart VS Code
3. Select QTMX- as language for .qtmx- files

### Acode

1. Download all JSON files
2. Import in Acode settings
3. Select QTMX- language

### Other Editors

Use `syntax-rules.json` as template for your editor's syntax definition.

## Features

✅ Syntax highlighting
✅ Code folding
✅ Auto-indentation
✅ Comment support
✅ String escaping
✅ Bracket matching
✅ Keyword highlighting

## Keywords

- **Control:** beQ-, qq-, bbq, aaq
- **Input/Output:** ingo, outgo
- **Validation:** tcq, check
- **Conditional:** F, f, El, el
- **Types:** string, int, float, bool, array, object
- **License:** MTK, GAF, UFG

## Colors

- Keywords: Blue
- Strings: Orange
- Comments: Green
- Types: Cyan
- Numbers: Light Green
- License: Red

## Usage

Create file: `app.qtmx-`

```qtmx
beQ-
  module my-service
  license: MTK
  
  bbq
    ingo input
      name: string
    ingo
  bbq
  
  aaq
    logic-block
      query data.fetch()
  aaq
  
qq-
