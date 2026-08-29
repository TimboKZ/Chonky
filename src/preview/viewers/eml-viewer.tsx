import { useMemo } from 'react'
import { Mail, Paperclip } from 'lucide-react'

import { parseEmlContent } from './lib/parse-eml'

/**
 * The body is markup written by whoever sent the message, so it renders under two
 * controls rather than one. This policy blocks remote references, which in email
 * are usually read-receipt tracking pixels; the empty sandbox on the frame blocks
 * what a policy has no directive for, notably a `<meta http-equiv="refresh">` to
 * an attacker's URL. Neither substitutes for the other. Images the message
 * actually carried are embedded as data: URIs by the parser, so they still render.
 */
const EMAIL_CONTENT_POLICY = "default-src 'none'; img-src data:; style-src 'unsafe-inline'; font-src data:; base-uri 'none'; form-action 'none'"

function toSandboxedDocument(htmlBody: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${EMAIL_CONTENT_POLICY}"><style>body{margin:0;padding:8px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5}img{max-width:100%;height:auto}</style></head><body>${htmlBody}</body></html>`
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleString()
  } catch {
    return dateString
  }
}

function extractEmailAddress(emailField: string): string {
  const match = emailField.match(/<([^>]+)>/) || emailField.match(/([^\s<>]+@[^\s<>]+)/)
  return match ? match[1] : emailField
}

function extractDisplayName(emailField: string): string {
  const match = emailField.match(/^([^<]+)<[^>]+>$/)
  if (match) {
    return match[1].trim().replace(/^["']|["']$/g, '')
  }
  return extractEmailAddress(emailField)
}

export interface EmlViewerProps {
  /** Raw .eml file content string */
  content: string
  /** Additional CSS class */
  className?: string
}

export function EmlViewer({ content, className = '' }: EmlViewerProps) {
  const emailData = useMemo(() => parseEmlContent(content), [content])

  // Images the reader is already looking at in the body are not also listed here.
  const listedAttachments = emailData.attachments.filter((attachment) => !attachment.renderedInline)

  return (
    <div className={`h-full flex flex-col bg-background text-left text-sm ${className}`}>
      {/* Email Header */}
      <div className="border-b border-gray-200 bg-gray-50">
        {/* Subject */}
        <div className="flex items-center gap-2 p-3 pb-2">
          <Mail className="h-4 w-4 text-blue-600 shrink-0" />
          <h2 className="font-semibold text-gray-900 wrap-break-word">{emailData.subject}</h2>
        </div>

        {/* Header Grid */}
        <div className="px-3 pb-3">
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
            <span className="text-gray-500 font-medium">From:</span>
            <span className="text-gray-900 break-all">
              {extractDisplayName(emailData.from)}
              {extractDisplayName(emailData.from) !== extractEmailAddress(emailData.from) && (
                <span className="text-gray-600 ml-1">&lt;{extractEmailAddress(emailData.from)}&gt;</span>
              )}
            </span>

            <span className="text-gray-500 font-medium">To:</span>
            <span className="text-gray-900 break-all">{emailData.to}</span>

            {emailData.cc && (
              <>
                <span className="text-gray-500 font-medium">CC:</span>
                <span className="text-gray-900 break-all">{emailData.cc}</span>
              </>
            )}

            {emailData.bcc && (
              <>
                <span className="text-gray-500 font-medium">BCC:</span>
                <span className="text-gray-900 break-all">{emailData.bcc}</span>
              </>
            )}

            <span className="text-gray-500 font-medium">Date:</span>
            <span className="text-gray-900">{formatDate(emailData.date)}</span>
          </div>
        </div>
      </div>

      {/* Email Body */}
      <div className="flex-1 pt-2">
        {emailData.htmlBody ? (
          <div className="prose max-w-none h-full">
            <iframe
              className="border border-gray-200 rounded bg-background w-full h-full"
              srcDoc={toSandboxedDocument(emailData.htmlBody)}
              sandbox=""
              title="Email Content"
            />
          </div>
        ) : (
          <div className="whitespace-pre-wrap text-gray-900 font-mono text-sm leading-relaxed overflow-auto h-full">
            {emailData.body || 'No message content'}
          </div>
        )}
      </div>

      {/* Attachments (if any) */}
      {listedAttachments.length > 0 && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <Paperclip className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Attachments ({listedAttachments.length})</span>
          </div>
          <div className="space-y-1">
            {listedAttachments.map((attachment, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">{attachment.filename}</span>
                <span className="text-gray-500">({attachment.contentType})</span>
                {attachment.size > 0 && <span className="text-gray-500">{formatBytes(attachment.size)}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
