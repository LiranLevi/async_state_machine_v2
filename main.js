const run_flow = require("./state_machine");

const flowsDir = process.argv[2];
const fs = require("fs");
const util = require('util');
const path = require("path");

const readDir = util.promisify(fs.readdir);

async function main() {
    const promises = [];
    try {
        const files = await readDir(flowsDir);

        for(let id = 0; id < files.length; id++) {
            let flow = require(path.resolve(flowsDir) + "/" + files[id]);
            promises.push(run_flow(flow, id));
        }

        return Promise.all(promises);

    } catch (err) {
        throw err;
    }
}

const start = new Date();
main()
.then(() => console.log("Total flow processing time: " + (new Date() - start) + "ms"))
.catch((err) => console.log("ERROR: " + err));
