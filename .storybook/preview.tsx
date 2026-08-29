import type { Preview } from '@storybook/react-vite'
import { useEffect } from 'react'
import '../src/styles.css'
import './storybook-tokens.css'

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
  globalTypes: {
    theme: {
      description: 'Theme applied to the document root, matching how a consuming FSG app sets it',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
          { value: 'dracula', icon: 'star', title: 'Dracula' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as string) || 'light'
      useEffect(() => {
        const root = document.documentElement
        root.classList.remove('light', 'dark', 'dracula')
        root.classList.add(theme)
      }, [theme])
      return (
        <div className="bg-background text-foreground h-screen w-screen p-4">
          <Story />
        </div>
      )
    },
  ],
}

export default preview
