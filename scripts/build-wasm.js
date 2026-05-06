const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const IGNORE_DIRS = ['node_modules', 'target', 'pkg', 'dist'];

function findRustProjects(dir) {
  let results = [];

  if (!fs.existsSync(dir)) return results;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !IGNORE_DIRS.includes(file)) {
      results = results.concat(findRustProjects(fullPath));
    } else if (file === 'Cargo.toml') {
      results.push(dir);
    }
  }

  return results;
}

const pluginsDir = path.join(__dirname, '../plugins');
const rustFolders = findRustProjects(pluginsDir);

if (rustFolders.length === 0) {
  console.log('No Cargo.toml found. Skipping Wasm build.');
  process.exit(0);
}

console.log(`Found ${rustFolders.length} Rust project(s). Starting build...`);

rustFolders.forEach(folder => {
  console.log(`\n-> Building Wasm in: ${folder}`);
  try {
    execSync('wasm-pack build --target web', { cwd: folder, stdio: 'inherit' });
  } catch (err) {
    console.error(`Build failed in ${folder}!`);
    process.exit(1);
  }
});
