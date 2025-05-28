import React from 'react';
import BrandFeature from './index';

export default {
  title: 'Organisms/BrandFeature',
  component: BrandFeature,
  parameters: {
    componentSubtitle: 'A component that displays brand information with an image and description',
    docs: {
      description: {
        component: 'The BrandFeature component displays branded content with an image, logo, and description text.',
      },
    },
  },
  argTypes: {
    brandData: {
      description: 'Object containing brand feature data',
      control: 'object',
    },
  },
};

const Template = (args) => <BrandFeature {...args} />;

export const Default = Template.bind({});
Default.args = {
  brandData: {
    featureImage: 'https://via.placeholder.com/800x800',
    logoImage: 'https://via.placeholder.com/200x80',
    description: 'This premium brand offers exceptional quality and innovative design. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
};

export const ShortDescription = Template.bind({});
ShortDescription.args = {
  brandData: {
    featureImage: 'https://via.placeholder.com/800x800',
    logoImage: 'https://via.placeholder.com/200x80',
    description: 'A short brand description with minimal text.',
  },
};

export const LongDescription = Template.bind({});
LongDescription.args = {
  brandData: {
    featureImage: 'https://via.placeholder.com/800x800',
    logoImage: 'https://via.placeholder.com/200x80',
    description: 'This premium brand offers exceptional quality and innovative design. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
}; 