import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

// Keep CLI phase inputs, outputs and errors available when artifact uploads fail.
// A diagnostic file is not a routed output and must not satisfy route-gate.ts.
const directory = "dist/autorouter-debug"
if (existsSync(directory)) {
  for (const name of readdirSync(directory).sort()) {
    if (
      !name.endsWith(".timeout.json") &&
      !name.endsWith(".meta.json") &&
      !name.endsWith(".input.simple-route.json") &&
      !name.endsWith(".output.traces.json") &&
      !name.endsWith(".error.json")
    ) continue
    console.log(`GBA_ROUTING_DIAGNOSTIC ${name}`)
    console.log(readFileSync(join(directory, name), "utf8"))
  }
}
