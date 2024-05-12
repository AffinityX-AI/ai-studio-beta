// instrumentation.ts or src/instrumentation.ts
export async function register() {
  const { registerHighlight } = await import('@highlight-run/next/server')

  registerHighlight({
    projectID: process.env.HIGHLIGHT_IO_PROJECT_ID!,
    serviceName: process.env.HIGHLIGHT_IO_SERVICE_NAME!,
  })
}
