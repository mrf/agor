/* eslint-disable react-refresh/only-export-components */
import type { Preview } from '@storybook/react-vite';
import React, { useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';

// Global decorator to wrap all stories with Ant Design ConfigProvider
const withAntdTheme = (Story, context) => {
  const isDark = context.globals.theme === 'dark';

  // Apply theme to Storybook's body for React Flow backgrounds
  useEffect(() => {
    document.body.style.background = isDark ? '#141414' : '#f5f5f5';
  }, [isDark]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Story />
    </ConfigProvider>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [withAntdTheme],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'dark',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
