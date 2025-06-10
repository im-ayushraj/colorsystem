import type { Meta, StoryObj } from '@storybook/react';
import { MultiStepWizard } from '../components/MultiStepWizard/MultiStepWizard';

const steps = [
  {
    title: 'Account Info',
    content: <div>Enter your account information.</div>,
    validate: () => true,
  },
  {
    title: 'Profile',
    content: <div>Fill out your profile details.</div>,
    validate: () => true,
    optional: true,
  },
  {
    title: 'Confirmation',
    content: <div>Review and confirm your details.</div>,
    validate: () => true,
  },
];

const meta: Meta<typeof MultiStepWizard> = {
  title: 'Components/MultiStepWizard',
  component: MultiStepWizard,
  parameters: {
    docs: {
      description: {
        component: 'Multi-step wizard form with progress indicator, validation, and animated transitions.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof MultiStepWizard>;

export const Basic: Story = {
  args: {
    steps,
    showSkip: true,
    asyncStep: true,
    loading: false,
    onComplete: () => alert('Wizard complete!'),
  },
};

export const Documentation: Story = {
  render: () => (
    <div>
      <h3>Component Anatomy</h3>
      <ul>
        <li>Progress bar: Step numbers, icons, checkmarks</li>
        <li>Step content: Form fields, validation, async loading</li>
        <li>Navigation: Next, Previous, Skip, Finish</li>
      </ul>
      <h3>States & Variants</h3>
      <ul>
        <li>Loading, Error, Completed, Optional steps, Animated transitions</li>
      </ul>
      <h3>Accessibility</h3>
      <ul>
        <li>Keyboard navigation (Tab, Enter, Arrow keys)</li>
        <li>ARIA roles: <code>list</code>, <code>listitem</code>, <code>region</code>, <code>button</code></li>
        <li>Focus management between steps</li>
      </ul>
      <h3>Theming & Responsiveness</h3>
      <ul>
        <li>Theme switcher (light/dark)</li>
        <li>Responsive: adapts to mobile and desktop</li>
      </ul>
      <h3>Best Practices</h3>
      <ul>
        <li>Keep steps focused and short</li>
        <li>Use validation for each step</li>
        <li>Provide clear feedback for errors and completion</li>
      </ul>
    </div>
  ),
};
