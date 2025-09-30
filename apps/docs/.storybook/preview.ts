import type { Preview } from '@storybook/web-components';

// Import design tokens CSS
import '../../../packages/tokens/dist/css/variables.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
      ],
    },
  },
  globalTypes: {
    theme: {
      description: 'VWX Design System Theme',
      defaultValue: 'bw',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'bw', title: 'Black & White', icon: 'circle' },
          { value: 'color', title: 'Color', icon: 'circlehollow' },
          { value: 'patina', title: 'Patina', icon: 'chromatic' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme || 'bw';

      // Apply theme to the document
      document.documentElement.setAttribute('data-theme', theme);

      // Return the story
      return story();
    },
  ],
};

export default preview;
