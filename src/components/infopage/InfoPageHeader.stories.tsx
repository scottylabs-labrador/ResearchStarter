import type { Meta, StoryObj } from '@storybook/react-vite';

import InfoPageHeader from './InfoPageHeader';

const meta = {
  component: InfoPageHeader,
} satisfies Meta<typeof InfoPageHeader>;

export default meta;

type Story = StoryObj<typeof InfoPageHeader>;

// Basic Story
export const Default: Story = {
  args: {
    title: 'Default Title',
    professorOrLabName: 'Default Professor',
    department: ['Default Department'],
    college: ['Default College'],
    tags: ['Default Tag'],
    isBookmarked: false,
    onBookmarkToggle: () => {},
    onApplyClick: () => {},
  },
};