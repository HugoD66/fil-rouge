#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');

const outPath = 'eslint-report.log';
// Lint uniquement TypeScript et HTML (sources), éviter les .js compilés
const args = ['.', '--ext', '.ts,.html', '--max-warnings=0', '--fix'];

const eslint = spawn('npx', ['eslint', ...args], { shell: true });

const outStream = fs.createWriteStream(outPath, { flags: 'w' });

eslint.stdout.on('data', (chunk) => {
  process.stdout.write(chunk);
  outStream.write(chunk);
});
eslint.stderr.on('data', (chunk) => {
  process.stderr.write(chunk);
  outStream.write(chunk);
});
eslint.on('close', (code) => {
  outStream.end();
  process.exit(code);
});
