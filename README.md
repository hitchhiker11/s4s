# Bitrix + React Frontend with Storybook

This project contains a React frontend for Bitrix CMS, with a comprehensive Storybook setup for component documentation and development.

## Setup and Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Running Storybook

To start the Storybook development server:
```bash
npm run storybook
```

This will start Storybook at [http://localhost:6006](http://localhost:6006)

## Component Structure

The components are organized following the Atomic Design methodology:

- **Atoms**: Basic building blocks like buttons, inputs, and typography
- **Molecules**: Combinations of atoms, like forms, cards, and search bars
- **Organisms**: Complex UI components composed of molecules and atoms
- **Templates**: Page-level component arrangements
- **Pages**: Complete page implementations

## Design System

The design system is built on a foundation of tokens:

- **Colors**: Brand colors and UI states
- **Typography**: Font families, sizes, and weights
- **Spacing**: Consistent spacing values
- **Sizes**: Dimensions and border-radius
- **Animations**: Timing functions and durations
- **Shadows**: Elevation levels
- **Breakpoints**: Responsive design breakpoints

## Creating New Components

1. Create a new component in the appropriate directory based on its complexity level
2. Create a story file with the same name as your component (e.g., `Button.stories.js`)
3. Run Storybook to see your component in action

### Example Story

```jsx
// MyComponent.stories.js
import React from 'react';
import MyComponent from './index';

export default {
  title: 'Atoms/MyComponent',
  component: MyComponent,
  parameters: {
    componentSubtitle: 'A brief description',
  },
  argTypes: {
    // Define controls for props
  },
};

// Create stories
export const Default = () => <MyComponent />;
export const Variant = () => <MyComponent variant="special" />;
```

## Integration with Bitrix

The React components are designed to work with Bitrix CMS through the existing AJAX handlers. For more information on this integration, please refer to the [Technical Requirements Document](frontend.mdc).

## Building Storybook

To build a static version of Storybook for deployment:

```bash
npm run build-storybook
```

This will create a `storybook-static` directory with the compiled Storybook that can be deployed to any static hosting service.

## Troubleshooting

If you encounter any issues with Storybook or component development, please check:

1. Make sure all dependencies are installed
2. Verify that your component imports are correct
3. Check the console for any errors 