import React from 'react';
import Button from './index';

export default {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    componentSubtitle: 'A versatile button component for user interactions',
    docs: {
      description: {
        component: 'The Button component is used for user actions and form submissions.',
      },
    },
  },
  argTypes: {
    variant: {
      description: 'The visual style of the button',
      options: ['primary', 'secondary', 'text'],
      control: { type: 'select' },
      defaultValue: 'primary',
    },
    size: {
      description: 'The size of the button',
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
      defaultValue: 'md',
    },
    fullWidth: {
      description: 'Whether the button should take up the full width of its container',
      control: 'boolean',
      defaultValue: false,
    },
    disabled: {
      description: 'Whether the button is disabled',
      control: 'boolean',
      defaultValue: false,
    },
    children: {
      description: 'The content of the button',
      control: 'text',
      defaultValue: 'Button Text',
    },
    onClick: {
      action: 'clicked',
      description: 'Function called when the button is clicked',
    },
  },
};

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
  children: 'Primary Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
  children: 'Secondary Button',
};

export const Text = Template.bind({});
Text.args = {
  variant: 'text',
  children: 'Text Button',
};

export const Small = Template.bind({});
Small.args = {
  size: 'sm',
  children: 'Small Button',
};

export const Medium = Template.bind({});
Medium.args = {
  size: 'md',
  children: 'Medium Button',
};

export const Large = Template.bind({});
Large.args = {
  size: 'lg',
  children: 'Large Button',
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  fullWidth: true,
  children: 'Full Width Button',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  children: 'Disabled Button',
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  children: (
    <>
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M8 3.5V12.5M3.5 8H12.5" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      Button with Icon
    </>
  ),
};

// Show all variants
export const AllVariants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ display: 'flex', gap: '16px' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="text">Text</Button>
    </div>
    <div style={{ display: 'flex', gap: '16px' }}>
      <Button variant="primary" disabled>Primary Disabled</Button>
      <Button variant="secondary" disabled>Secondary Disabled</Button>
      <Button variant="text" disabled>Text Disabled</Button>
    </div>
    <div style={{ display: 'flex', gap: '16px' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  </div>
); 