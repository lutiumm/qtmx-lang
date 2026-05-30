#!/usr/bin/env node

const fs = require('fs');

const command = process.argv[2];

if (command === 'init') {
  const template = `beQ-
  module my-service
  license: MTK
  endpoint: "https://api.example.com"
  
  bbq
    input-block
      ingo input-data
        field: string
      ingo
  bbq
  
  aaq
    logic-block
      query data.fetch()
  aaq
  
qq-`;
  
  fs.writeFileSync('app.qtmx-', template);
  console.log('✅ Created app.qtmx-');
} else if (command === 'help') {
  console.log('qtmx init - Create new project');
} else {
  console.log('Use: qtmx help');
}
