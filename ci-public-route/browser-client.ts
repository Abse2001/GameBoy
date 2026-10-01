import { createCircuitWebWorker } from "@tscircuit/eval/worker-lite-wrapper"

declare global {
  interface Window {
    captureRoutingEvent: (event: Record<string, unknown>) => Promise<void>
    runBoard: (fsMap: Record<string, string> | null) => Promise<{
      circuit: unknown[]
      renderFailure: string | null
      asyncErrors: unknown[]
    }>
  }
}

window.runBoard = async (fsMap): Promise<{
  circuit: unknown[]; renderFailure: string | null; asyncErrors: unknown[]
}> => {
  // The solver worker is the unmodified, hash-verified published tscircuit file.
  const worker = await createCircuitWebWorker({ webWorkerUrl: new URL("/worker.js", location.href) })
  const asyncErrors: unknown[] = []
  const pendingEvents: Promise<void>[] = []
  let lastProgress = 0
  for (const name of ["autorouting:start", "autorouting:progress", "autorouting:end", "autorouting:error"] as const) {
    worker.on(name, (event): void => {
      if (name === "autorouting:progress") {
        if (performance.now() - lastProgress < 15000) return
        lastProgress = performance.now()
      }
      const { debugGraphics, pcbTracePaths, ...evidence } = event as typeof event & { debugGraphics?: unknown; pcbTracePaths?: unknown }
      pendingEvents.push(window.captureRoutingEvent({ ...evidence, type: name }))
    })
  }
  worker.on("asyncEffect:end", (event): void => {
    if (event.error) asyncErrors.push(event)
  })
  let renderFailure: string | null = null
  try {
    if (fsMap) {
      await worker.executeWithFsMap({ fsMap, mainComponentPath: "index.circuit.tsx" })
    } else {
      // Small upstream-style smoke check: initialize the same copper-pour WASM
      // in Chromium before spending resources on the full board.
      await worker.execute(`circuit.add(<board width="10mm" height="10mm"><resistor name="R1" resistance="1k" footprint="0402" /><copperpour connectsTo="net.GND" layer="top" clearance="0.15mm" /></board>)`)
    }
    await worker.renderUntilSettled()
  } catch (error) {
    renderFailure = String(error)
  }
  try {
    const circuit = await worker.getCircuitJson()
    await Promise.all(pendingEvents)
    return { circuit, renderFailure, asyncErrors }
  } finally {
    await worker.kill()
  }
}
