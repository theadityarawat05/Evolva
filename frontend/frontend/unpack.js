const fs = require('fs');
const path = require('path');

// Locate the source text file inside your Evolva directory
const sourcePath = '/storage/emulated/0/Evolva/bootstrapVX.txt';
const projectRoot = process.cwd();

if (!fs.existsSync(sourcePath)) {
  console.error(`[-] Error: Could not find bootstrap file at ${sourcePath}`);
  process.exit(1);
}

console.log(`[+] Found bootstrap data source. Reading files...`);
const content = fs.readFileSync(sourcePath, 'utf8');

// Regex patterns to capture start and end block markers
const fileRegex = /===\s*START_FILE:\s*([^\s]+)\s*===([\s\S]*?)===\s*END_FILE\s*===/g;
let match;
let count = 0;

while ((match = fileRegex.exec(content)) !== null) {
  const relativeTarget = match[1].trim();
  let fileBody = match[2];

  // Strip out source tagging artifacts if present
  fileBody = fileBody.replace(/\/g, '');

  const absoluteTarget = path.join(projectRoot, relativeTarget);
  const targetDir = path.dirname(absoluteTarget);

  try {
    // Generate directories on the fly if they don't exist yet
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(absoluteTarget, fileBody.trim() + '\n', 'utf8');
    console.log(`[✓] Unpacked: ${relativeTarget}`);
    count++;
  } catch (err) {
    console.error(`[-] Failed writing target file: ${relativeTarget}`, err);
  }
}

console.log(`\n[+] Success! Placed ${count} source files into their target paths.`);
