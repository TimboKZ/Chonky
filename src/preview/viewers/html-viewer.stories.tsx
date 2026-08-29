import type { Meta, StoryObj } from '@storybook/react-vite'
import { HtmlViewer } from './html-viewer'

const meta: Meta<typeof HtmlViewer> = {
  title: 'Components/Viewers/HtmlViewer',
  component: HtmlViewer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A standalone HTML viewer that renders raw HTML string content in a sandboxed iframe. The default is a full sandbox — no scripts, opaque origin — because a previewed file is rarely one the app authored. Pass `sandbox` to relax it for markup you produced yourself.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    content: `<html>
<head><style>body { font-family: sans-serif; padding: 20px; } h1 { color: #2563eb; }</style></head>
<body>
<h1>Hello World</h1>
<p>This is a standalone HTML preview rendered in a sandboxed iframe.</p>
<ul>
<li>Item one</li>
<li>Item two</li>
<li>Item three</li>
</ul>
</body>
</html>`,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

export const ScriptsBlockedByDefault: Story = {
  args: {
    content: `<html>
<body style="font-family: sans-serif; padding: 20px;">
<h2>Scripts do not run here</h2>
<p id="status">The script below tries to replace this line. Under the default sandbox it never runs, so this text stays.</p>
<script>document.getElementById('status').textContent = 'SCRIPT RAN — the sandbox was relaxed.'</script>
</body>
</html>`,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '300px' }}>
        <Story />
      </div>
    ),
  ],
}

export const RelaxedSandbox: Story = {
  args: {
    content: `<html><body style="font-family: sans-serif; padding: 20px;"><h2>Relaxed sandbox</h2><p>Rendered with <code>sandbox="allow-same-origin"</code>, which is looser than the default. Only do this for markup your own app produced.</p></body></html>`,
    sandbox: 'allow-same-origin',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '300px' }}>
        <Story />
      </div>
    ),
  ],
}
