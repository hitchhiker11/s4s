import React from 'react';
import Input from './index';

export default {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    componentSubtitle: 'A versatile input component for user data entry',
    docs: {
      description: {
        component: 'The Input component is used for collecting user data in forms.',
      },
    },
  },
  argTypes: {
    label: {
      description: 'Label text for the input',
      control: 'text',
    },
    placeholder: {
      description: 'Placeholder text for the input',
      control: 'text',
    },
    type: {
      description: 'The type of input',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      control: { type: 'select' },
      defaultValue: 'text',
    },
    size: {
      description: 'The size of the input',
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
      defaultValue: 'md',
    },
    fullWidth: {
      description: 'Whether the input should take up the full width of its container',
      control: 'boolean',
      defaultValue: false,
    },
    disabled: {
      description: 'Whether the input is disabled',
      control: 'boolean',
      defaultValue: false,
    },
    error: {
      description: 'Error message to display',
      control: 'text',
    },
    helperText: {
      description: 'Helper text to display below the input',
      control: 'text',
    },
    onChange: {
      action: 'changed',
      description: 'Function called when the input value changes',
    },
  },
};

const Template = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Label',
  placeholder: 'Placeholder',
};

export const WithHelperText = Template.bind({});
WithHelperText.args = {
  label: 'Email',
  type: 'email',
  placeholder: 'your-email@example.com',
  helperText: 'We\'ll never share your email with anyone else.',
};

export const WithError = Template.bind({});
WithError.args = {
  label: 'Password',
  type: 'password',
  placeholder: 'Enter password',
  error: 'Password must be at least 8 characters',
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Disabled Input',
  placeholder: 'You cannot change this',
  disabled: true,
};

export const Small = Template.bind({});
Small.args = {
  label: 'Small Input',
  placeholder: 'Small',
  size: 'sm',
};

export const Large = Template.bind({});
Large.args = {
  label: 'Large Input',
  placeholder: 'Large',
  size: 'lg',
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  label: 'Full Width Input',
  placeholder: 'This input takes up the full width',
  fullWidth: true,
};

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
  placeholder: 'Input without label',
};

// Display various input types
export const AllInputTypes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <Input label="Text" type="text" placeholder="Text input" />
    <Input label="Email" type="email" placeholder="email@example.com" />
    <Input label="Password" type="password" placeholder="Password" />
    <Input label="Number" type="number" placeholder="0" />
    <Input label="Tel" type="tel" placeholder="+1 (555) 555-5555" />
    <Input label="URL" type="url" placeholder="https://example.com" />
    <Input label="Search" type="search" placeholder="Search..." />
  </div>
); 