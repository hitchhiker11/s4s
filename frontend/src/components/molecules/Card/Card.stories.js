import React from 'react';
import Card from './index';
import Button from '../../atoms/Button';

export default {
  title: 'Molecules/Card',
  component: Card,
  subcomponents: {
    Header: Card.Header,
    Media: Card.Media,
    Content: Card.Content,
    Footer: Card.Footer,
  },
  parameters: {
    componentSubtitle: 'A versatile card component for content display',
    docs: {
      description: {
        component: 'The Card component is used to group and display content in a clear and concise format.',
      },
    },
  },
  argTypes: {
    variant: {
      description: 'The visual style of the card',
      options: ['default', 'primary', 'secondary', 'outlined'],
      control: { type: 'select' },
      defaultValue: 'default',
    },
    elevation: {
      description: 'The elevation/shadow level of the card',
      options: ['flat', 'sm', 'md', 'lg'],
      control: { type: 'select' },
      defaultValue: 'sm',
    },
    width: {
      description: 'The width of the card',
      control: 'text',
    },
    height: {
      description: 'The height of the card',
      control: 'text',
    },
    fullWidth: {
      description: 'Whether the card should take up the full width of its container',
      control: 'boolean',
      defaultValue: false,
    },
    hover: {
      description: 'Whether the card should have a hover effect',
      control: 'boolean',
      defaultValue: false,
    },
    clickable: {
      description: 'Whether the card should appear clickable',
      control: 'boolean',
      defaultValue: false,
    },
    onClick: {
      action: 'clicked',
      description: 'Function called when the card is clicked (if clickable)',
    },
  },
};

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

export const Basic = () => (
  <Card style={{ width: '300px' }}>
    <Card.Content>
      <h3>Basic Card</h3>
      <p>{lorem}</p>
    </Card.Content>
  </Card>
);

export const WithHeader = () => (
  <Card style={{ width: '300px' }}>
    <Card.Header>
      <h3>Card Title</h3>
    </Card.Header>
    <Card.Content>
      <p>{lorem}</p>
    </Card.Content>
  </Card>
);

export const WithMedia = () => (
  <Card style={{ width: '300px' }}>
    <Card.Media image="https://via.placeholder.com/300x200" />
    <Card.Content>
      <h3>Card with Image</h3>
      <p>{lorem}</p>
    </Card.Content>
  </Card>
);

export const WithFooter = () => (
  <Card style={{ width: '300px' }}>
    <Card.Header>
      <h3>Card with Footer</h3>
    </Card.Header>
    <Card.Content>
      <p>{lorem}</p>
    </Card.Content>
    <Card.Footer align="flex-end">
      <Button variant="secondary" size="sm">Cancel</Button>
      <Button variant="primary" size="sm">Confirm</Button>
    </Card.Footer>
  </Card>
);

export const CompleteCard = () => (
  <Card 
    style={{ width: '300px' }}
    hover={true}
    clickable={true}
    onClick={() => console.log('Card clicked')}
  >
    <Card.Media image="https://via.placeholder.com/300x150" />
    <Card.Header>
      <h3>Complete Card Example</h3>
    </Card.Header>
    <Card.Content>
      <p>{lorem}</p>
    </Card.Content>
    <Card.Footer align="space-between">
      <Button variant="text" size="sm">Learn More</Button>
      <Button variant="primary" size="sm">Buy Now</Button>
    </Card.Footer>
  </Card>
);

export const PrimaryVariant = () => (
  <Card 
    style={{ width: '300px' }}
    variant="primary"
  >
    <Card.Content>
      <h3 style={{ color: 'white' }}>Primary Card</h3>
      <p style={{ color: 'white' }}>{lorem}</p>
    </Card.Content>
  </Card>
);

export const SecondaryVariant = () => (
  <Card 
    style={{ width: '300px' }}
    variant="secondary"
  >
    <Card.Content>
      <h3 style={{ color: 'white' }}>Secondary Card</h3>
      <p style={{ color: 'white' }}>{lorem}</p>
    </Card.Content>
  </Card>
);

export const OutlinedVariant = () => (
  <Card 
    style={{ width: '300px' }}
    variant="outlined"
  >
    <Card.Content>
      <h3>Outlined Card</h3>
      <p>{lorem}</p>
    </Card.Content>
  </Card>
);

export const ElevationLevels = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
    <Card style={{ width: '200px' }} elevation="flat">
      <Card.Content>
        <h4>Flat</h4>
        <p>No shadow</p>
      </Card.Content>
    </Card>
    <Card style={{ width: '200px' }} elevation="sm">
      <Card.Content>
        <h4>Small</h4>
        <p>Light shadow</p>
      </Card.Content>
    </Card>
    <Card style={{ width: '200px' }} elevation="md">
      <Card.Content>
        <h4>Medium</h4>
        <p>Medium shadow</p>
      </Card.Content>
    </Card>
    <Card style={{ width: '200px' }} elevation="lg">
      <Card.Content>
        <h4>Large</h4>
        <p>Heavy shadow</p>
      </Card.Content>
    </Card>
  </div>
);

export const CardGrid = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
    {[1, 2, 3, 4, 5, 6].map(i => (
      <Card key={i} hover={true} clickable={true}>
        <Card.Media image={`https://via.placeholder.com/300x150?text=Card+${i}`} />
        <Card.Content>
          <h3>Card {i}</h3>
          <p>This is a card in a responsive grid layout. It will adapt to different screen sizes.</p>
        </Card.Content>
        <Card.Footer>
          <Button variant="primary" size="sm" fullWidth>View Details</Button>
        </Card.Footer>
      </Card>
    ))}
  </div>
); 