import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I outsourced the deadline to a subagent. It outsourced it to another subagent. They are still interviewing candidates.";

// Runtime gate: the sealed scorer accepts UTF-8 text of 1 to 200
// characters, not only white space, on a single line. Ties break on
// bytes, so the line is pure ASCII and bytes equal characters.
const chars = [...LINE].length;
if (chars < 1 || chars > 200) {
  throw new Error(`line must be 1-200 characters, got ${chars}`);
}
if (LINE.trim().length === 0) {
  throw new Error("line must not be only white space");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("line must be a single line");
}
const bytes = Buffer.byteLength(LINE, "utf8");
if (bytes !== chars) {
  throw new Error(`line must be pure ASCII, ${chars} chars but ${bytes} bytes`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Read-back check: what landed on disk must be byte-identical.
const written = readFileSync(outPath, "utf8");
if (written !== LINE) {
  throw new Error("entry.txt does not match the line");
}
