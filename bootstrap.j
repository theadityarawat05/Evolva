const fs = require("fs");

const bootstrap = fs.readFileSync( "bootstrap_v1.txt", "utf8"
);

const regex = /=== FILE:\s*(.*?)\s*===\n([\s\S]*?)(?=\n=== 
FILE:|$)/g;

let match;

while ((match = regex.exec(bootstrap)) !== null) { const 
  filePath = match[1].trim(); const content = 
  match[2].trimStart();

  fs.mkdirSync( require("path").dirname(filePath), { recursive: 
    true }
  );

  fs.writeFileSync( filePath, content, "utf8"
  );

  console.log(`✓ ${filePath}`);
}

console.log("\nBootstrap import completed.")
