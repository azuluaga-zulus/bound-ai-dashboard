#!/usr/bin/env node

const { exec } = require('child_process');

console.log('🚀 Forcing manual deployment with crypto UUID fix...');

// This script would need to run on the server to force update
const commands = [
  'cd /var/www/bound-ai-dashboard',
  'git fetch origin',
  'git reset --hard origin/main',
  'npm ci',
  'npm run build',
  'pm2 reload bound-ai'
];

console.log('Commands to run on server:');
commands.forEach(cmd => console.log(`  ${cmd}`));

console.log('\nTo manually fix the server, SSH into 206.81.1.88 and run:');
console.log(commands.join(' && '));