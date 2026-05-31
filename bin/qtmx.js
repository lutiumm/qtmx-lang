#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ===== TOKENIZER =====
class Tokenizer {
  constructor(source) {
    this.source = source;
    this.pos = 0;
    this.tokens = [];
  }

  tokenize() {
    while (this.pos < this.source.length) {
      const char = this.source[this.pos];
      
      // Skip whitespace
      if (/\s/.test(char)) {
        this.pos++;
        continue;
      }
      
      // Skip comments
      if (char === '/' && this.source[this.pos + 1] === '/') {
        while (this.pos < this.source.length && this.source[this.pos] !== '\n') {
          this.pos++;
        }
        continue;
      }
      
      // Keywords and identifiers
      if (/[a-zA-Z_]/.test(char)) {
        let word = '';
        while (this.pos < this.source.length && /[a-zA-Z0-9_\-#\+]/.test(this.source[this.pos])) {
          word += this.source[this.pos];
          this.pos++;
        }
        this.tokens.push({ type: 'WORD', value: word });
        continue;
      }
      
      // Strings
      if (char === '"' || char === "'") {
        const quote = char;
        this.pos++;
        let str = '';
        while (this.pos < this.source.length && this.source[this.pos] !== quote) {
          str += this.source[this.pos];
          this.pos++;
        }
        this.pos++;
        this.tokens.push({ type: 'STRING', value: str });
        continue;
      }
      
      // Numbers
      if (/\d/.test(char)) {
        let num = '';
        while (this.pos < this.source.length && /\d/.test(this.source[this.pos])) {
          num += this.source[this.pos];
          this.pos++;
        }
        this.tokens.push({ type: 'NUMBER', value: parseInt(num) });
        continue;
      }
      
      // Symbols
      this.tokens.push({ type: 'SYMBOL', value: char });
      this.pos++;
    }
    
    return this.tokens;
  }
}

// ===== PARSER =====
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  parse() {
    const ast = {
      type: 'Program',
      services: []
    };

    while (this.pos < this.tokens.length) {
      const token = this.tokens[this.pos];
      
      if (token.value === 'beQ' || token.value === 'beQ-') {
        ast.services.push(this.parseService());
      } else {
        this.pos++;
      }
    }

    return ast;
  }

  parseService() {
    const service = {
      type: 'Service',
      edition: 'qtmx-',
      name: 'default',
      endpoint: '',
      events: [],
      blocks: [],
      license: 'MTK'
    };

    this.pos++; // Skip beQ-

    while (this.pos < this.tokens.length) {
      const token = this.tokens[this.pos];
      
      // End of service
      if (token.value === 'qq' || token.value === 'qq-' || token.value === 'qq+' || token.value === 'qq#') {
        service.edition = token.value;
        this.pos++;
        break;
      }
      
      // Service name
      if (token.type === 'WORD' && token.value === 'module') {
        this.pos++;
        if (this.pos < this.tokens.length && this.tokens[this.pos].type === 'WORD') {
          service.name = this.tokens[this.pos].value;
          this.pos++;
        }
      }
      
      // Endpoint
      if (token.value === 'endpoint' && this.tokens[this.pos + 1]?.value === ':') {
        this.pos += 2;
        if (this.tokens[this.pos].type === 'STRING') {
          service.endpoint = this.tokens[this.pos].value;
          this.pos++;
        }
      }
      
      // License
      if (token.value === 'license' && this.tokens[this.pos + 1]?.value === ':') {
        this.pos += 2;
        if (this.tokens[this.pos].type === 'WORD') {
          service.license = this.tokens[this.pos].value;
          this.pos++;
        }
      }
      
      // Events
      if (token.value === 'events' && this.tokens[this.pos + 1]?.value === ':') {
        this.pos += 2;
        while (this.pos < this.tokens.length && this.tokens[this.pos].value !== 'bbq') {
          if (this.tokens[this.pos].type === 'WORD') {
            service.events.push(this.tokens[this.pos].value);
          }
          this.pos++;
        }
      }
      
      this.pos++;
    }

    return service;
  }
}

// ===== CODE GENERATOR =====
class CodeGenerator {
  generate(ast) {
    let code = '// Generated from QTMX- v17\n\n';
    code += 'const services = {};\n\n';

    for (const service of ast.services) {
      code += `// Service: ${service.name}\n`;
      code += `services['${service.name}'] = {\n`;
      code += `  name: '${service.name}',\n`;
      code += `  endpoint: '${service.endpoint}',\n`;
      code += `  edition: '${service.edition}',\n`;
      code += `  license: '${service.license}',\n`;
      code += `  execute: async function(data) {\n`;
      code += `    return { success: true, service: '${service.name}', data: data };\n`;
      code += `  }\n`;
      code += `};\n\n`;
    }

    code += 'module.exports = services;\n';
    return code;
  }
}

// ===== RUNTIME =====
class Runtime {
  constructor() {
    this.services = {};
    this.state = {};
  }

  registerService(name, service) {
    this.services[name] = service;
  }

  async executeService(serviceName, data) {
    const service = this.services[serviceName];
    if (!service) {
      throw new Error(`Service '${serviceName}' not found`);
    }
    return await service.execute(data);
  }
}

// ===== REPL =====
class REPL {
  constructor() {
    this.services = {};
    this.variables = {};
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true
    });
  }

  start() {
    console.log('╔════════════════════════════════╗');
    console.log('║   QTMX- Interactive Shell v17  ║');
    console.log('║  Pure Reactive Language        ║');
    console.log('╚════════════════════════════════╝\n');
    console.log('Commands: event, vars, services, help, exit\n');

    this.prompt();
  }

  prompt() {
    this.rl.question('qtmx> ', (input) => {
      this.handleCommand(input);
      this.prompt();
    });
  }

  handleCommand(input) {
    const parts = input.trim().split(' ');
    const command = parts[0];

    if (command === 'exit' || command === 'quit') {
      this.rl.close();
      process.exit(0);
    }

    if (command === 'help') {
      console.log('\nAvailable commands:');
      console.log('  event <name> <json>  - Trigger event');
      console.log('  vars                 - Show variables');
      console.log('  services             - List services');
      console.log('  help                 - Show this help');
      console.log('  exit                 - Exit REPL\n');
    } else if (command === 'vars') {
      console.log('📊 Variables:', Object.keys(this.variables).length === 0 ? '(none)' : this.variables);
    } else if (command === 'services') {
      console.log('📦 Services:', Object.keys(this.services).length === 0 ? '(none)' : Object.keys(this.services));
    } else if (command === 'event') {
      if (parts.length < 2) {
        console.log('Usage: event <name> [data]');
      } else {
        console.log(`▶️  Event fired: ${parts[1]}`);
        console.log('✓ Event handled');
      }
    } else if (input.trim() === '') {
      // Empty input, do nothing
    } else {
      console.log(`Unknown command: ${command}. Type 'help' for commands.`);
    }
  }
}

// ===== MAIN EXECUTION =====
function main() {
  const file = process.argv[2];

  if (!file) {
    console.log('QTMX- v17 Interpreter');
    console.log('Usage: qtmx <file.qtmx->');
    console.log('Example: qtmx app.qtmx-\n');
    process.exit(1);
  }

  if (!fs.existsSync(file)) {
    console.error(`❌ Error: File '${file}' not found`);
    process.exit(1);
  }

  try {
    const source = fs.readFileSync(file, 'utf8');
    
    // Compile
    const tokenizer = new Tokenizer(source);
    const tokens = tokenizer.tokenize();
    
    const parser = new Parser(tokens);
    const ast = parser.parse();
    
    const generator = new CodeGenerator();
    const jsCode = generator.generate(ast);
    
    // Execute
    console.log(`▶️  Executing ${path.basename(file)}...\n`);
    
    const services = eval(jsCode);
    
    // Create runtime
    const runtime = new Runtime();
    for (const name in services) {
      runtime.registerService(name, services[name]);
    }
    
    // Show info
    if (ast.services.length > 0) {
      console.log(`📦 Loaded ${ast.services.length} service(s)`);
      ast.services.forEach(s => {
        console.log(`   • ${s.name} (${s.edition})`);
      });
      console.log('');
    }
    
    console.log('✅ QTMX- execution completed successfully\n');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

// Run
main();
