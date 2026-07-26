const fs = require("fs");
const path = require("path");

const bootstrapFile =
process.argv[2] || "bootstrap_v3.txt";

const bootstrap =
fs.readFileSync(
  bootstrapFile,
  "utf8"
);

const regex =
/=== START_FILE:\s*(.*?)\s*===([\s\S]*?)=== END_FILE ===/g;

let match;
let count = 0;

while ((match = regex.exec(bootstrap)) !== null) {

  const filePath =
    match[1].trim();

  const content =
    match[2]
      .replace(/^\s*\n/, "");

  fs.mkdirSync(
    path.dirname(filePath),
    {
      recursive: true,
    }
  );

  fs.writeFileSync(
    filePath,
    content,
    "utf8"
  );

  console.log("✓", filePath);

  count++;

}

console.log(
  `\nImported ${count} files successfully.`
);
