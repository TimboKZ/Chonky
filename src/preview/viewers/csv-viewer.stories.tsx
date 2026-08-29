import type { Meta, StoryObj } from '@storybook/react-vite'
import { CsvViewer } from './csv-viewer'

const meta: Meta<typeof CsvViewer> = {
  title: 'Components/Viewers/CsvViewer',
  component: CsvViewer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A standalone CSV viewer that renders raw CSV string content as a table. Supports quoted fields, configurable max rows, and sticky headers.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const SAMPLE_CSV = `Name,Email,Department,Salary
Alice Johnson,alice@example.com,Engineering,120000
Bob Smith,bob@example.com,Marketing,95000
Carol White,carol@example.com,Engineering,115000
Dave Brown,"Brown, Dave",Sales,88000
Eve Davis,eve@example.com,HR,92000`

const LARGE_CSV = ['ID,Name,Value', ...Array.from({ length: 100 }, (_, i) => `${i + 1},Item ${i + 1},${(Math.random() * 1000).toFixed(2)}`)].join(
  '\n',
)

export const Default: Story = {
  args: {
    content: SAMPLE_CSV,
  },
}

export const WithQuotedFields: Story = {
  args: {
    content: `"Name","Description","Price"
"Widget A","A small, useful widget","$9.99"
"Widget B","A ""premium"" widget","$19.99"
"Widget C","Multi-line
description here","$29.99"`,
  },
}

export const TruncatedRows: Story = {
  args: {
    content: LARGE_CSV,
    maxRows: 10,
  },
}
