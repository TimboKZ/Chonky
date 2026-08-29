import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmlViewer } from './eml-viewer'

const meta: Meta<typeof EmlViewer> = {
  title: 'Components/Viewers/EmlViewer',
  component: EmlViewer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A standalone .eml email viewer that parses and renders raw EML file content. Displays email headers (from, to, cc, date, subject), body content (plain text or HTML), and attachment metadata.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const PLAIN_TEXT_EML = `From: Alice Johnson <alice@example.com>
To: Bob Smith <bob@example.com>
Subject: Meeting Tomorrow
Date: Mon, 10 Feb 2025 09:30:00 -0600
Content-Type: text/plain; charset="UTF-8"

Hi Bob,

Just a reminder about our meeting tomorrow at 10am.

Please bring the Q4 report.

Thanks,
Alice`

const HTML_EML = `From: "Support Team" <support@example.com>
To: user@example.com
CC: manager@example.com
Subject: Your ticket has been resolved
Date: Tue, 11 Feb 2025 14:00:00 -0600
Content-Type: text/html; charset="UTF-8"

<html>
<body style="font-family: Arial, sans-serif; padding: 20px;">
<h2 style="color: #2563eb;">Ticket #12345 Resolved</h2>
<p>Hello,</p>
<p>Your support ticket has been resolved. Here's a summary:</p>
<ul>
<li><strong>Issue:</strong> Login not working</li>
<li><strong>Resolution:</strong> Password reset link sent</li>
<li><strong>Resolved by:</strong> Jane Doe</li>
</ul>
<p>If you have any further questions, please reply to this email.</p>
<p style="color: #6b7280; font-size: 12px;">— Support Team</p>
</body>
</html>`

/**
 * What Gmail sends when a photo is pasted into a reply: the body sits in a
 * multipart/alternative nested inside a multipart/related, the pasted image is a
 * sibling referenced by cid:, and a genuine attachment follows it. Before the
 * parser handled nesting this rendered as a dump of the raw message.
 */
const NESTED_WITH_INLINE_IMAGE = [
  'From: Ryan Olson <ryan.olson@fsgi.com>',
  'To: 92J14019@jobs.fsgapps.com',
  'Subject: Fwd: Slab edge photos',
  'Date: Thu, 20 Aug 2026 12:02:33 -0500',
  'Content-Type: multipart/related; boundary="OUTER-7db5"',
  '',
  '--OUTER-7db5',
  'Content-Type: multipart/alternative; boundary="OUTER-7db5-inner"',
  '',
  '--OUTER-7db5-inner',
  'Content-Type: text/plain; charset="UTF-8"',
  'Content-Transfer-Encoding: quoted-printable',
  '',
  'Photo from site, taken Fri, Aug 7 at 11:57=E2=80=AFAM.',
  '',
  '--OUTER-7db5-inner',
  'Content-Type: text/html; charset="UTF-8"',
  'Content-Transfer-Encoding: quoted-printable',
  '',
  '<div dir=3D"ltr"><p>Photo from site, taken Fri, Aug 7 at 11:57=E2=80=AFAM.</p>',
  '<img src=3D"cid:ii_msj6io360" alt=3D"slab-edge.png" width=3D"240"></div>',
  '',
  '--OUTER-7db5-inner--',
  '--OUTER-7db5',
  'Content-Type: image/png; name="slab-edge.png"',
  'Content-Disposition: inline; filename="slab-edge.png"',
  'Content-Transfer-Encoding: base64',
  'Content-ID: <ii_msj6io360>',
  '',
  'iVBORw0KGgoAAAANSUhEUgAAADwAAAAoCAIAAAAt2Q6oAAAAS0lEQVR42u3OQQkAIBAAMFPYwAtj',
  'DaNZywaWMIK/g4PBAqydiHKatLS0tLS0tLT0Jz3WLUdaWlpaWlpaOjXd9yxHWlpaWlpaWjrTA8Of',
  'S25rFMm7AAAAAElFTkSuQmCC',
  '',
  '--OUTER-7db5',
  'Content-Type: application/pdf; name="rfi-12.pdf"',
  'Content-Disposition: attachment; filename="rfi-12.pdf"',
  'Content-Transfer-Encoding: base64',
  '',
  'JVBERi0xLjQKJcOkw7zDtsOfCg==',
  '',
  '--OUTER-7db5--',
].join('\n')

export const PlainText: Story = {
  args: {
    content: PLAIN_TEXT_EML,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '500px' }}>
        <Story />
      </div>
    ),
  ],
}

export const HtmlEmail: Story = {
  args: {
    content: HTML_EML,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '500px' }}>
        <Story />
      </div>
    ),
  ],
}

export const NestedWithInlineImage: Story = {
  args: {
    content: NESTED_WITH_INLINE_IMAGE,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The red/blue/green banded image renders inline from a `cid:` reference, the narrow no-break space in the date decodes rather than showing as `â€¯`, and only `rfi-12.pdf` is listed under Attachments — the image the reader is already looking at is not listed a second time.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '500px' }}>
        <Story />
      </div>
    ),
  ],
}
