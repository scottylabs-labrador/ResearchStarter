import type { Meta, StoryObj } from '@storybook/react';
import InterestsSkillsSection from './InterestsSkillsSection';

const meta: Meta<typeof InterestsSkillsSection> = {
  component: InterestsSkillsSection,
  title: 'Components/InterestsSkillsSection',
};

export default meta;
type Story = StoryObj<typeof InterestsSkillsSection>;

export const Default: Story = {
  args: {
    items: [],
    onAddItem: (item) => console.log('Added item:', item),
    onRemoveItem: (item) => console.log('Removed item:', item),
  },
};

export const Populated: Story = {
  args: {
    items: ["Reading", "Hiking", "Coding", "JavaScript", "React", "Node.js"],
    onAddItem: (item) => console.log('Added item:', item),
    onRemoveItem: (item) => console.log('Removed item:', item),
  },
};
