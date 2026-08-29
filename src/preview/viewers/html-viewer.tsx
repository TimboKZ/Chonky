export interface HtmlViewerProps {
  /** Raw HTML string content to render in a sandboxed iframe */
  content: string
  /**
   * Sandbox attributes for the iframe. Defaults to a full sandbox — no scripts
   * and an opaque origin — because this component previews files, and a file
   * being previewed is rarely one the app authored.
   *
   * The sandbox is the only control here — unlike EmlViewer, the document is
   * rendered exactly as given, with no content security policy wrapped around it —
   * so relax it only for markup your own app produced. In particular,
   * "allow-same-origin allow-scripts" together defeat the sandbox: a srcDoc frame
   * granted both runs with the embedding app's own origin, so script in the
   * document can reach the app's storage and session.
   */
  sandbox?: string
  /** Additional CSS class */
  className?: string
}

export function HtmlViewer({ content, sandbox = '', className = '' }: HtmlViewerProps) {
  return (
    <div className={`h-full flex flex-col bg-background ${className}`}>
      <iframe className="w-full h-full border-0" srcDoc={content} sandbox={sandbox} title="HTML File Preview" />
    </div>
  )
}
