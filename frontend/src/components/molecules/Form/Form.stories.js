import React from 'react';
import Form from './index';

export default {
  title: 'Molecules/Form',
  component: Form,
  subcomponents: { FormField: Form.Field },
  parameters: {
    componentSubtitle: 'A form component that combines input fields and buttons',
    docs: {
      description: {
        component: 'The Form component is used for creating forms with standardized styling and behavior.',
      },
    },
  },
  argTypes: {
    submitLabel: {
      description: 'Text to display on the submit button',
      control: 'text',
      defaultValue: 'Submit',
    },
    cancelLabel: {
      description: 'Text to display on the cancel button',
      control: 'text',
      defaultValue: 'Cancel',
    },
    showCancel: {
      description: 'Whether to show a cancel button',
      control: 'boolean',
      defaultValue: false,
    },
    isSubmitting: {
      description: 'Whether the form is currently submitting',
      control: 'boolean',
      defaultValue: false,
    },
    buttonAlign: {
      description: 'Alignment of form buttons',
      options: ['flex-start', 'center', 'flex-end', 'space-between'],
      control: { type: 'select' },
      defaultValue: 'flex-start',
    },
    onSubmit: {
      action: 'submitted',
      description: 'Function called when the form is submitted',
    },
    onCancel: {
      action: 'cancelled',
      description: 'Function called when the cancel button is clicked',
    },
  },
};

const Template = (args) => (
  <Form {...args}>
    <Form.Field
      label="Full Name"
      name="fullName"
      placeholder="John Doe"
    />
    <Form.Field
      label="Email"
      name="email"
      type="email"
      placeholder="john.doe@example.com"
    />
    <Form.Field
      label="Password"
      name="password"
      type="password"
      placeholder="Enter your password"
    />
  </Form>
);

export const Default = Template.bind({});
Default.args = {
  submitLabel: 'Submit',
};

export const WithCancel = Template.bind({});
WithCancel.args = {
  submitLabel: 'Submit',
  cancelLabel: 'Cancel',
  showCancel: true,
};

export const Submitting = Template.bind({});
Submitting.args = {
  submitLabel: 'Submit',
  isSubmitting: true,
};

export const CenteredButtons = Template.bind({});
CenteredButtons.args = {
  submitLabel: 'Submit',
  cancelLabel: 'Cancel',
  showCancel: true,
  buttonAlign: 'center',
};

export const RightAlignedButtons = Template.bind({});
RightAlignedButtons.args = {
  submitLabel: 'Submit',
  cancelLabel: 'Cancel',
  showCancel: true,
  buttonAlign: 'flex-end',
};

export const LoginForm = () => (
  <Form 
    submitLabel="Log In" 
    showCancel={false}
    buttonAlign="center"
    // onSubmit={(e) => console.log('Login form submitted')}
  >
    <Form.Field
      label="Email or Username"
      name="username"
      placeholder="Enter your email or username"
    />
    <Form.Field
      label="Password"
      name="password"
      type="password"
      placeholder="Enter your password"
      helperText="Forgot your password?"
    />
  </Form>
);

export const RegistrationForm = () => (
  <Form 
    submitLabel="Create Account" 
    showCancel={true}
    cancelLabel="Back"
    buttonAlign="space-between"
    // onSubmit={(e) => console.log('Registration form submitted')}
    // onCancel={() => console.log('Registration cancelled')}
  >
    <Form.Field
      label="First Name"
      name="firstName"
      placeholder="First Name"
    />
    <Form.Field
      label="Last Name"
      name="lastName"
      placeholder="Last Name"
    />
    <Form.Field
      label="Email"
      name="email"
      type="email"
      placeholder="email@example.com"
      helperText="We'll never share your email"
    />
    <Form.Field
      label="Password"
      name="password"
      type="password"
      placeholder="Create a password"
    />
    <Form.Field
      label="Confirm Password"
      name="confirmPassword"
      type="password"
      placeholder="Confirm password"
      error="Passwords don't match"
    />
  </Form>
); 