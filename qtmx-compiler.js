// QTMX- Compiler v17.0.0

class Tokenizer {
  constructor(source) {
    this.source = source;
    this.pos = 0;
    this.tokens = [];
  }

  tokenize() {
    while (this.pos < this.source.length) {
      const char = this.source[this.pos];
      
      if (/\s/.test(char)) {
        this.pos++;
      } else if (char === '/') {
        // Skip comments
        while (this.pos < this.source.length && this.source[this.pos] !== '\n') {
          this.pos++;
        }
      } else if (/[a-zA-Z_]/.test(char)) {
        // Keyword or identifier
        let word = '';
        while (this.pos < this.source.length && /[a-zA-Z0-9_-]/.test(this.source[this.pos])) {
          word += this.source[this.pos];
          this.pos++;
        }
        this.tokens.push({ type: 'WORD', value: word });
      } else if (/["']/.test(char)) {
        // String
        const quote = char;
        this.pos++;
        let str = '';
        while (this.pos < this.source.length && this.source[this.pos] !== quote) {
          str += this.source[this.pos];
          this.pos++;
        }
        this.pos++;
        this.tokens.push({ type: 'STRING', value: str });
      } else if (/\d/.test(char)) {
        // Number
        let num = '';
        while (this.pos < this.source.length && /\d/.test(this.source[this.pos])) {
          num += this.source[this.pos];
          this.pos++;
        }
        this.tokens.push({ type: 'NUMBER', value: parseInt(num) });
      } else {
        // Symbol
        this.tokens.push({ type: 'SYMBOL', value: char });
        this.pos++;
      }
    }
    return this.tokens;
  }
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  parse() {
    const ast = {
      type: 'Program',
      body: []
    };

    while (this.pos < this.tokens.length) {
      const token = this.tokens[this.pos];
      
      if (token.value === 'beQ' || token.value === 'beQ-') {
        ast.body.push(this.parseService());
      } else {
        this.pos++;
      }
    }

    return ast;
  }

  parseService() {
    this.pos++; // Skip beQ-
    
    const service = {
      type: 'Service',
      name: '',
      blocks: []
    };

    while (this.pos < this.tokens.length) {
      const token = this.tokens[this.pos];
      
      if (token.value === 'qq' || token.value === 'qq-') {
        this.pos++;
        break;
      }
      
      if (token.type === 'WORD') {
        service.name = token.value;
      }
      
      this.pos++;
    }

    return service;
  }
}

class CodeGenerator {
  generate(ast) {
    let code = '// Generated QTMX- Code\n\n';
    code += 'const services = {};\n\n';

    for (const node of ast.body) {
      if (node.type === 'Service') {
        code += `services['${node.name}'] = {\n`;
        code += `  name: '${node.name}',\n`;
        code += `  execute: async function() { return { success: true }; }\n`;
        code += `};\n\n`;
      }
    }

    code += 'module.exports = services;\n';
    return code;
  }
}

// Export
module.exports = { Tokenizer, Parser, CodeGenerator };
