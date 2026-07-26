import fs from 'fs';
import path from 'path';

const bootstrapPath = '/storage/emulated/0/Evolva/bootstrapVX.txt';

if (!fs.existsSync(bootstrapPath)) {
    console.error(`Missing bootstrap file at: ${bootstrapPath}`);
    process.exit(1);
}

const content = fs.readFileSync(bootstrapPath, 'utf8');
const blocks = content.split(/===\s*START_FILE:\s*/);

// Skip the first split element if it's empty
for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const endMarkerIndex = block.indexOf('===');
    if (endMarkerIndex === -1) continue;

    const filePath = block.substring(0, endMarkerIndex).trim();
    let fileContent = block.substring(endMarkerIndex + 3).split(/===\s*END_FILE\s*===/)[0].trim();

    // Remove text indexing markers like 
    fileContent = fileContent.replace(/\/g, '');

    const targetDir = path.dirname(filePath);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(filePath, fileContent + '\n', 'utf8');
    console.log(`Pasted: ${filePath}`);
}
console.log('All code successfully distributed to respective folders.');
