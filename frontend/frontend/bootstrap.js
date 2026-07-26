const fs = require("fs");
const path = require("path");

const INPUT = "bootstrapVX.txt";

const content = fs.readFileSync(INPUT, "utf8");

const regex =
/=== START_FILE:\s*(.*?)\s*===\s*([\s\S]*?)\s*=== END_FILE ===/g;

let match;
let count = 0;

while ((match = regex.exec(content)) !== null) {
    const filePath = match[1].trim();
    const fileContent = match[2].replace(/^\r?\n/, "");

    fs.mkdirSync(path.dirname(filePath), {
        recursive: true,
    });

    fs.writeFileSync(
        filePath,
        fileContent,
        "utf8",
    );

    console.log("✓", filePath);
    count++;
}

console.log(`\nDone. Extracted ${count} files.`);
