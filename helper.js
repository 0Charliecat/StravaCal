const fs = require("fs")
const path = require("node:path")
const jidelnyIDs = require("./jidelny.json")

// Generate `/lib/jidelny.js`
fs.writeFile(path.join(__dirname, "./lib/jidelny.js"), `export default ${JSON.stringify(jidelnyIDs)}`, (err) => {
    if (err) {
        console.log(`🔴 • GENERATE ERROR: Generate \`/lib/jidelny.js\`: ${err}`)
    } else {
        console.log(`ℹ️ • GENERATE INFO: Generate \`/lib/jidelny.js\`: Success`)
    }
})