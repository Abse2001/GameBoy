import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

// Keep CLI phase/timeout evidence available even when artifact uploads fail.
// A diagnostic file is not a routed output and must not satisfy route-gate.ts.
const directory = "dist/autorouter-debug"
if (existsSync(directory)) {
  for (const name of readdirSync(directory).sort()) {
    if (!name.endsWith(".timeout.json") && !name.endsWith(".meta.json")) continue
    console.log(`GBA_ROUTING_DIAGNOSTIC ${name}`)
    console.log(readFileSync(join(directory, name), "utf8"))
  }
}
