/**
 * Ambient declarations for the optional peer dependencies. Each is reached only
 * through a dynamic `import()` behind a capability check, so the package must type
 * check whether or not the peer is installed — a hard `import type` from these
 * modules would break the build for a consumer who opted out of them.
 */

declare module 'libheif-js/wasm-bundle' {
  const libheif: unknown
  export default libheif
}

declare module 'docx-preview' {
  export function renderAsync(
    data: ArrayBuffer | Blob | Uint8Array,
    container: HTMLElement,
    styleContainer?: HTMLElement,
    options?: Record<string, unknown>,
  ): Promise<void>
}
