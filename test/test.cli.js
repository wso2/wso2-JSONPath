import {promisify} from "util";
import {exec as _exec} from "child_process";
import {readFile} from "fs/promises";
import path from "path";

const exec = promisify(_exec);

// Derived rather than hard-coded so the WSO2 fork's package name does not
// conflict with upstream on rebase.
const {name: pkgName} = JSON.parse(await readFile("package.json", "utf8"));

describe("JSONPath - cli", () => {
    it("with filePath and jsonPath", async () => {
        const out = await exec("bin/jsonpath-cli.js package.json name");
        expect(out.stdout).to.equal(`[ '${pkgName}' ]\n`);
    });

    it("invalid arguments", async () => {
        const binPath = path.resolve("bin/jsonpath-cli.js");
        let out;
        try {
            out = await exec("bin/jsonpath-cli.js wrong-file.json");
        } catch (err) {
            out = err;
        }
        expect(out).to.have.property("code", 1);
        expect(out).to.have.property("stderr");
        expect(out.stderr).to.include(`usage: ${binPath} <file> <path>\n\n`);
    });
});
