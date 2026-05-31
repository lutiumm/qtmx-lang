// QTMX- Standard Library v17.0.0

const stdlib = {
  // String functions
  strlen: (str) => str.length,
  upper: (str) => str.toUpperCase(),
  lower: (str) => str.toLowerCase(),
  trim: (str) => str.trim(),
  split: (str, sep) => str.split(sep),
  join: (arr, sep) => arr.join(sep),
  
  // Array functions
  len: (arr) => arr.length,
  push: (arr, item) => { arr.push(item); return arr; },
  pop: (arr) => arr.pop(),
  
  // Math functions
  abs: (n) => Math.abs(n),
  min: (...args) => Math.min(...args),
  max: (...args) => Math.max(...args),
  
  // Type functions
  type: (v) => typeof v,
  
  // Utility
  print: (msg) => console.log(msg),
};

module.exports = stdlib;
