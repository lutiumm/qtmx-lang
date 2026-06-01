#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const c = {
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// ===== QTMX COMPILER & EXECUTOR =====
class QtmxRuntime {
  constructor(code) {
    this.code = code;
    this.variables = {};
    this.functions = {};
    this.output = [];
  }

  run() {
    // Extract emit success messages
    const emitMatches = this.code.match(/emit\s+success\s+"([^"]*)"/g) || [];
    
    emitMatches.forEach(match => {
      const msg = match.match(/emit\s+success\s+"([^"]*)"/);
      if (msg) {
        this.output.push(msg[1]);
      }
    });

    // Extract variable assignments
    const varMatches = this.code.match(/var\s+([a-zA-Z0-9_]+)\s*=\s*([^,\n]+)/g) || [];
    varMatches.forEach(match => {
      const parts = match.match(/var\s+([a-zA-Z0-9_]+)\s*=\s*(.+)/);
      if (parts) {
        this.variables[parts[1]] = parts[2].trim();
      }
    });

    return this.output;
  }

  getModuleName() {
    const match = this.code.match(/module\s+([a-zA-Z0-9_-]+)/);
    return match ? match[1] : 'program';
  }

  isValid() {
    return this.code.includes('beQ-') && this.code.includes('qq-');
  }
}

// ===== INTERACTIVE EDITOR WITH FILE SAVE =====
class QtmxEditor {
  constructor(filename = null) {
    this.code = '';
    this.filename = filename;
    this.isSaved = false;
  }

  start() {
    console.log(`\n${c.blue}╔═══════════════════════════════════════╗${c.reset}`);
    console.log(`${c.blue}║   QTMX Interactive Editor v1.0      ║${c.reset}`);
    console.log(`${c.blue}║   General Purpose Language          ║${c.reset}`);
    
    if (this.filename) {
      console.log(`${c.blue}║   File: ${this.filename.padEnd(30)}║${c.reset}`);
    }
    
    console.log(`${c.blue}╚═══════════════════════════════════════╝${c.reset}\n`);

    console.log(`${c.yellow}Write QTMX code (multi-line supported)${c.reset}`);
    console.log(`${c.yellow}Commands:${c.reset}`);
    console.log(`  ${c.cyan}save${c.reset}    - Save to file & execute`);
    console.log(`  ${c.cyan}show${c.reset}    - Show your code`);
    console.log(`  ${c.cyan}run${c.reset}     - Execute code`);
    console.log(`  ${c.cyan}clear${c.reset}   - Delete code`);
    console.log(`  ${c.cyan}vars${c.reset}    - Show variables`);
    console.log(`  ${c.cyan}help${c.reset}    - Show help`);
    console.log(`  ${c.cyan}exit${c.reset}    - Exit (without saving)\n`);

    this.repl();
  }

  repl() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true
    });

    const prompt = () => {
      rl.question(`${c.magenta}qtmx>>>${c.reset} `, (input) => {
        const cmd = input.trim();

        if (cmd === 'exit' || cmd === 'quit') {
          if (!this.isSaved && this.code.trim()) {
            console.log(`${c.yellow}⚠️  Code not saved!${c.reset}`);
            prompt();
            return;
          }
          console.log(`\n${c.green}Goodbye!${c.reset}\n`);
          rl.close();
          process.exit(0);
        }

        if (cmd === 'save') {
          this.save(rl);
          return;
        }

        if (cmd === 'run') {
          this.execute();
          prompt();
          return;
        }

        if (cmd === 'show') {
          this.show();
          prompt();
          return;
        }

        if (cmd === 'vars') {
          this.showVars();
          prompt();
          return;
        }

        if (cmd === 'clear') {
          this.code = '';
          this.isSaved = false;
          console.log(`${c.green}✓ Code cleared${c.reset}`);
          prompt();
          return;
        }

        if (cmd === 'help') {
          this.help();
          prompt();
          return;
        }

        if (cmd === '') {
          prompt();
          return;
        }

        // Add code line
        this.code += cmd + '\n';
        this.isSaved = false;
        prompt();
      });
    };

    prompt();
  }

  save(rl) {
    if (!this.code.trim()) {
      console.log(`${c.red}❌ No code to save!${c.reset}`);
      return;
    }

    let filename = this.filename;

    if (!filename) {
      // Ask for filename
      rl.question(`${c.yellow}Filename (without .qtmx-):${c.reset} `, (input) => {
        filename = input.trim();
        if (!filename) {
          console.log(`${c.red}Invalid filename${c.reset}`);
          return;
        }
        this.saveFile(filename, rl);
      });
    } else {
      this.saveFile(filename, rl);
    }
  }

  saveFile(filename, rl) {
    // Add .qtmx- extension
    if (!filename.endsWith('.qtmx-')) {
      filename = filename + '.qtmx-';
    }

    try {
      // Save file
      fs.writeFileSync(filename, this.code);
      this.isSaved = true;

      console.log(`\n${c.green}💾 Saved as ${filename}${c.reset}\n`);

      // Execute immediately
      this.execute();

      // Continue editing
      const prompt = () => {
        rl.question(`${c.magenta}qtmx>>>${c.reset} `, (input) => {
          const cmd = input.trim();

          if (cmd === 'exit') {
            console.log(`\n${c.green}Goodbye!${c.reset}\n`);
            rl.close();
            process.exit(0);
          }

          if (cmd === 'save') {
            this.save(rl);
            return;
          }

          if (cmd === 'run') {
            this.execute();
            prompt();
            return;
          }

          if (cmd === 'show') {
            this.show();
            prompt();
            return;
          }

          if (cmd === 'vars') {
            this.showVars();
            prompt();
            return;
          }

          if (cmd === 'clear') {
            this.code = '';
            this.isSaved = false;
            console.log(`${c.green}✓ Code cleared${c.reset}`);
            prompt();
            return;
          }

          if (cmd === 'help') {
            this.help();
            prompt();
            return;
          }

          if (cmd !== '') {
            this.code += cmd + '\n';
            this.isSaved = false;
          }

          prompt();
        });
      };

      prompt();

    } catch (err) {
      console.error(`${c.red}❌ Error saving: ${err.message}${c.reset}`);
    }
  }

  execute() {
    if (!this.code.trim()) {
      console.log(`${c.red}No code to execute!${c.reset}`);
      return;
    }

    console.log(`${c.green}▶️  Executing...${c.reset}\n`);

    const runtime = new QtmxRuntime(this.code);

    if (!runtime.isValid()) {
      console.log(`${c.red}❌ Invalid QTMX syntax. Use beQ- and qq-${c.reset}\n`);
      return;
    }

    const output = runtime.run();
    
    if (output.length === 0) {
      console.log(`${c.yellow}ℹ️  No output. Use: emit success "message"${c.reset}\n`);
      return;
    }

    // Show output
    output.forEach(msg => {
      console.log(msg);
    });

    console.log();
    console.log(`${c.cyan}📦 ${runtime.getModuleName()}${c.reset}`);
    console.log(`${c.green}✅ Done${c.reset}\n`);
  }

  show() {
    if (!this.code.trim()) {
      console.log(`${c.yellow}No code written${c.reset}`);
      return;
    }

    console.log(`\n${c.cyan}─── Your Code ───${c.reset}`);
    this.code.split('\n').forEach((line, i) => {
      if (line) console.log(`${c.yellow}${i + 1}${c.reset}  ${line}`);
    });
    console.log(`${c.cyan}─────────────────${c.reset}\n`);
  }

  showVars() {
    const runtime = new QtmxRuntime(this.code);
    runtime.run();
    
    if (Object.keys(runtime.variables).length === 0) {
      console.log(`${c.yellow}No variables${c.reset}`);
      return;
    }

    console.log(`${c.cyan}Variables:${c.reset}`);
    for (const [name, value] of Object.entries(runtime.variables)) {
      console.log(`  ${c.yellow}${name}${c.reset} = ${value}`);
    }
  }

  help() {
    console.log(`
${c.cyan}QTMX Language - General Purpose Programming${c.reset}

${c.yellow}Syntax:${c.reset}
  beQ-              Start program
  qq-               End program
  module name       Define module
  var x = value     Define variable
  emit success "x"  Output
  aaq               Logic block
  bbq               Data block

${c.yellow}Commands:${c.reset}
  save   - Save to file & execute
  run    - Execute code
  show   - Display code
  vars   - Show variables
  clear  - Delete code
  help   - Show this
  exit   - Quit

${c.yellow}Example:${c.reset}
  beQ-
    module calculator
    var x = 10
    var y = 20
    aaq
      emit success "Sum: 30"
    aaq
  qq-
    `);
  }
}

// ===== EXECUTE FILE =====
function execute(file) {
  if (!fs.existsSync(file)) {
    console.error(`${c.red}❌ File not found: ${file}${c.reset}`);
    process.exit(1);
  }

  try {
    const source = fs.readFileSync(file, 'utf8');
    console.log(`${c.green}▶️  Executing ${path.basename(file)}...${c.reset}\n`);

    const runtime = new QtmxRuntime(source);

    if (!runtime.isValid()) {
      console.log(`${c.red}❌ Invalid QTMX syntax${c.reset}`);
      process.exit(1);
    }

    const output = runtime.run();
    output.forEach(msg => {
      console.log(msg);
    });

    console.log();
    console.log(`${c.cyan}📦 ${runtime.getModuleName()}${c.reset}`);
    console.log(`${c.green}✅ Done${c.reset}\n`);

  } catch (err) {
    console.error(`${c.red}❌ Error: ${err.message}${c.reset}`);
    process.exit(1);
  }
}

// ===== HELP =====
function help() {
  console.log(`
${c.cyan}╔══════════════════════════════════╗${c.reset}
${c.cyan}║   QTMX v17.0.2                  ║${c.reset}
${c.cyan}║   General Purpose Language      ║${c.reset}
${c.cyan}╚══════════════════════════════════╝${c.reset}

${c.yellow}Usage:${c.reset}
  qtmx              Interactive editor
  qtmx ext file     Create & edit file
  qtmx <file>       Execute file
  qtmx help         Show help

${c.yellow}Examples:${c.reset}
  qtmx              # Open editor
  qtmx ext myapp    # Create myapp.qtmx-
  qtmx app.qtmx-    # Run file

${c.yellow}Basic Program:${c.reset}
  beQ-
    module myapp
    var x = 5
    aaq
      emit success "Value: 5"
    aaq
  qq-

${c.cyan}Built by lutium, age 12${c.reset}
${c.cyan}GitHub: github.com/lutiumm/qtmx-lang${c.reset}
  `);
}

// ===== MAIN =====
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Interactive editor
    const editor = new QtmxEditor();
    editor.start();
  } else if (args[0] === 'ext') {
    // qtmx ext filename
    const filename = args[1] || 'app';
    const editor = new QtmxEditor(filename);
    editor.start();
  } else if (args[0] === 'help' || args[0] === '--help') {
    help();
  } else if (args[0].endsWith('.qtmx-') || args[0].endsWith('.qtmx+') || args[0].endsWith('.qtmx#')) {
    execute(args[0]);
  } else {
    console.log(`${c.red}Unknown: ${args[0]}${c.reset}`);
    console.log(`Type: qtmx help`);
    process.exit(1);
  }
}

main();
