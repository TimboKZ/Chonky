# Primitives

These are **adapters, not implementations**. Every one of them re-exports a
component from `@fsg/gui-bytes/components/ui`, bridging only the small API
differences this package's call sites assume (a `size` token on the dialog, a
`content` prop on the tooltip, 0–1 progress instead of 0–100).

They exist so the browser has one import site per primitive, not so it has its
own design system. Do not reimplement a control here — if gui-bytes lacks
something, add it there.

The imports deliberately target `@fsg/gui-bytes/components/ui` rather than the
package root. `ui/` imports nothing from meetings or the file browser, so the
graph stays acyclic even though gui-bytes' meetings entry consumes this package.
