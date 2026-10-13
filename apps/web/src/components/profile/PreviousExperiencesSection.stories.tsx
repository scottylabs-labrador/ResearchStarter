import type { Meta, StoryObj } from '@storybook/react';
import PreviousExperiencesSection from './PreviousExperiencesSection';

const meta: Meta<typeof PreviousExperiencesSection> = {
  title: 'Profile/PreviousExperiencesSection',
  component: PreviousExperiencesSection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    initialExperiences: {
      control: 'text',
      description: 'Initial text for previous experiences',
    },
    onSave: {
      action: 'onSave',
      description: 'Callback when experiences are saved',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PreviousExperiencesSection>;

export const Default: Story = {
  args: {
    initialExperiences: [
      { id: '1', text: 'This is a default previous experience entry.' },
      { id: '2', text: 'Another experience here.' },
    ],
  },
};

export const Empty: Story = {
  args: {
    initialExperiences: [],
  },
};

export const LongText: Story = {
  args: {
    initialExperiences: [
      { id: '1', text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.` },
    ],
  },
};
