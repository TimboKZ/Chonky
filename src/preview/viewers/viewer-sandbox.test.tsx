import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { HtmlViewer } from './html-viewer'
import { EmlViewer } from './eml-viewer'

/**
 * The sandbox default is a security boundary, not a style choice, and nothing
 * else in the suite would notice it changing back. `allow-same-origin` and
 * `allow-scripts` together give a srcDoc frame the embedding app's own origin,
 * so a previewed file could reach that app's storage and session.
 */
describe('HtmlViewer sandbox', () => {
  it('renders a fully sandboxed frame by default', () => {
    const markup = renderToStaticMarkup(<HtmlViewer content="<p>hi</p>" />)

    expect(markup).toContain('sandbox=""')
    expect(markup).not.toContain('allow-scripts')
    expect(markup).not.toContain('allow-same-origin')
  })

  it('renders the value a consumer passes instead', () => {
    const markup = renderToStaticMarkup(<HtmlViewer content="<p>hi</p>" sandbox="allow-same-origin" />)

    expect(markup).toContain('sandbox="allow-same-origin"')
  })
})

describe('EmlViewer sandbox', () => {
  it('renders a fully sandboxed frame with no way to relax it', () => {
    const message = ['From: a@b.c', 'Content-Type: text/html', '', '<p>hi</p>'].join('\n')
    const markup = renderToStaticMarkup(<EmlViewer content={message} />)

    expect(markup).toContain('sandbox=""')
    expect(markup).not.toContain('allow-scripts')
  })

  it('carries the content security policy in the document it renders', () => {
    const message = ['From: a@b.c', 'Content-Type: text/html', '', '<p>hi</p>'].join('\n')
    const markup = renderToStaticMarkup(<EmlViewer content={message} />)

    // Remote references in email are usually read-receipt tracking pixels, and
    // the images the message carried are embedded rather than linked, so nothing
    // fetched off-origin is needed to render the body. Entities in the expected
    // strings are React escaping the srcDoc attribute, not part of the policy.
    expect(markup).toContain('http-equiv=&quot;Content-Security-Policy&quot;')
    expect(markup).toContain('default-src &#x27;none&#x27;')
    expect(markup).toContain('img-src data:')
  })
})
