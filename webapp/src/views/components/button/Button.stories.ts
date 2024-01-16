import type { Meta, StoryObj } from '@storybook/react';

import Button  from './Button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    buttonType: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Elige el tipo de botón',
      },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Primary: Story = {
  args: {
    label: 'Primary',
    buttonType: 'primary',
    color: 'primary',
    variant: 'contained',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary',
    buttonType: 'secondary',
    color: 'secondary',
    variant: 'outlined',
  },
};
