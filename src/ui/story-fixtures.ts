/**
 * Content for the Storybook fixtures.
 *
 * The memory adapter serves whatever a node's `content` holds, so giving these
 * files real bytes is what makes the preview panel actually preview in Storybook
 * rather than falling back for every selection.
 */

/** Decodes a base64 fixture into bytes. */
function fromBase64(base64: string): Uint8Array {
  const binary = atob(base64)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

/**
 * A `data:` URL for text content.
 *
 * `btoa` takes one byte per code unit, so passing it a JavaScript string throws on
 * anything above U+00FF — an em dash in a caption is enough. Encoding to UTF-8
 * first and building the binary string from those bytes is what makes it safe.
 */
export function toDataUrl(content: string, mimeType: string): string {
  const bytes = new TextEncoder().encode(content)
  let binary = ''
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000))
  }
  return `data:${mimeType};base64,${btoa(binary)}`
}

export const PUNCH_LIST_CSV = `Item,Location,Trade,Status,Due
1,Lobby,Drywall,Open,2026-09-04
2,Level 2 Corridor,Paint,In progress,2026-09-06
3,Roof Deck,Membrane,Open,2026-09-11
4,Suite 210,Electrical,Complete,2026-08-22
5,Loading Dock,Concrete,Blocked,2026-09-18
6,Stairwell B,Handrail,Open,2026-09-09
7,Mech Room,HVAC,In progress,2026-09-02
8,Suite 214,Flooring,Complete,2026-08-19`

export const FIELD_NOTES_TXT = `Site visit — 28 Aug 2026
Attending: site super, mechanical sub, FSG PM

- Roof membrane patch at the NE corner is holding; no moisture at the probe.
- Suite 210 panel schedule does not match as-builts. Sub to redline and resubmit.
- Loading dock pour is blocked pending the revised embed layout.
- Two HVAC diffusers on L2 are backordered to 11 Sep.

Next visit: 4 Sep, walk the punch list with the GC.`

export const SITE_SUMMARY_HTML = `<h1>Weekly Site Summary</h1>
<p><strong>Job 40112</strong> &mdash; week ending 28 August 2026</p>
<h2>Progress</h2>
<ul>
  <li>Level 2 corridor paint at 80%</li>
  <li>Roof membrane patch complete and tested</li>
  <li>Suite 214 flooring signed off</li>
</ul>
<h2>Blockers</h2>
<p>Loading dock pour is held pending the revised embed layout from structural.</p>
<table border="1" cellpadding="6" cellspacing="0">
  <tr><th>Trade</th><th>Open items</th></tr>
  <tr><td>Drywall</td><td>1</td></tr>
  <tr><td>Paint</td><td>1</td></tr>
  <tr><td>Electrical</td><td>0</td></tr>
</table>`

export const APPROVAL_EML = `From: Dana Whitfield <dana.whitfield@example.com>
To: FSG Project Team <projects@example.com>
Subject: Re: Job 40112 - submittal 03-2 approved
Date: Thu, 27 Aug 2026 14:12:08 -0500
MIME-Version: 1.0
Content-Type: text/html; charset=utf-8
Content-Transfer-Encoding: quoted-printable

<p>Approved as noted. Please proceed with fabrication.</p>
<p>One correction: the embed layout on sheet S-201 supersedes what was in the =
original package. Use revision C.</p>
<p>--<br>Dana Whitfield<br>Structural Engineer of Record</p>
`

/** A small SVG standing in for a site photo — it renders from a data: URL. */
export const SITE_PHOTO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <rect width="400" height="300" fill="#7dd3fc"/>
  <rect y="190" width="400" height="110" fill="#a3a3a3"/>
  <rect x="40" y="70" width="120" height="120" fill="#e5e7eb" stroke="#6b7280" stroke-width="2"/>
  <rect x="60" y="95" width="30" height="30" fill="#93c5fd"/>
  <rect x="110" y="95" width="30" height="30" fill="#93c5fd"/>
  <rect x="60" y="140" width="30" height="30" fill="#93c5fd"/>
  <rect x="110" y="140" width="80" height="50" fill="#78350f"/>
  <rect x="220" y="30" width="24" height="160" fill="#f59e0b"/>
  <rect x="220" y="30" width="130" height="10" fill="#f59e0b"/>
  <line x1="330" y1="40" x2="330" y2="95" stroke="#374151" stroke-width="3"/>
  <rect x="305" y="95" width="50" height="35" fill="#d97706"/>
  <text x="20" y="285" font-family="sans-serif" font-size="16" fill="#111827">Front elevation — 28 Aug 2026</text>
</svg>`

/** ASCII STL of a single bracket-ish wedge, enough for the 3D viewer to load. */
export const BRACKET_STL = `solid bracket
facet normal 0 0 -1
  outer loop
    vertex 0 0 0
    vertex 40 0 0
    vertex 40 30 0
  endloop
endfacet
facet normal 0 0 -1
  outer loop
    vertex 0 0 0
    vertex 40 30 0
    vertex 0 30 0
  endloop
endfacet
facet normal 0 -1 0
  outer loop
    vertex 0 0 0
    vertex 0 0 12
    vertex 40 0 12
  endloop
endfacet
facet normal 0 -1 0
  outer loop
    vertex 0 0 0
    vertex 40 0 12
    vertex 40 0 0
  endloop
endfacet
facet normal -1 0 0
  outer loop
    vertex 0 0 0
    vertex 0 30 0
    vertex 0 30 12
  endloop
endfacet
facet normal -1 0 0
  outer loop
    vertex 0 0 0
    vertex 0 30 12
    vertex 0 0 12
  endloop
endfacet
facet normal 0.6 0.8 0
  outer loop
    vertex 40 0 0
    vertex 0 30 12
    vertex 0 30 0
  endloop
endfacet
facet normal 0.6 0.8 0
  outer loop
    vertex 40 0 0
    vertex 40 0 12
    vertex 0 30 12
  endloop
endfacet
endsolid bracket`

/** A structurally valid single-page PDF, so the iframe preview has something real. */
export const CONTRACT_PDF = fromBase64(
  'JVBERi0xLjQKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCAzMjAgMTgwXS9Db250ZW50cyA0IDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNSAwIFI+Pj4+Pj4KZW5kb2JqCjQgMCBvYmoKPDwvTGVuZ3RoIDEwOT4+c3RyZWFtCkJUIC9GMSAyMCBUZiAyOCAxMjAgVGQgKFNpZ25lZCBDb250cmFjdCkgVGogRVQKQlQgL0YxIDExIFRmIDI4IDkyIFRkIChKb2IgNDAxMTIgLSBleGVjdXRlZCAzMCBKdWwgMjAyNikgVGogRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8L1R5cGUvRm9udC9TdWJ0eXBlL1R5cGUxL0Jhc2VGb250L0hlbHZldGljYT4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1NCAwMDAwMCBuIAowMDAwMDAwMTA1IDAwMDAwIG4gCjAwMDAwMDAyMTcgMDAwMDAgbiAKMDAwMDAwMDM3NCAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNi9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCjQzNwolJUVPRgo=',
)
