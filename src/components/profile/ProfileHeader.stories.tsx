import type { Meta, StoryObj } from '@storybook/react';
import ProfileHeader from './ProfileHeader';

const meta: Meta<typeof ProfileHeader> = {
  component: ProfileHeader,
  title: 'Components/ProfileHeader',
};

export default meta;
type Story = StoryObj<typeof ProfileHeader>;

export const Default: Story = {
  args: {
    name: "Your Name",
    major: "Your Major",
    class: "Your Class",
    email: "Your Email",
  },
};

export const Populated: Story = {
  args: {
    profileImage: "https://i.ibb.co/8NHp83N/profile.png",
    name: "Jane Doe",
    major: "Computer Science",
    class: "Senior",
    email: "jane.doe@example.com",
  },
};
