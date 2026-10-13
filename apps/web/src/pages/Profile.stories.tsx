import type { Meta, StoryObj } from '@storybook/react';
import ProfilePage from './Profile';

const meta: Meta<typeof ProfilePage> = {
  component: ProfilePage,
  title: 'Pages/ProfilePage',
};

export default meta;
type Story = StoryObj<typeof ProfilePage>;

export const Primary: Story = {
  args: {},
};

export const Populated: Story = {
  args: {
    profileImage: "https://i.ibb.co/8NHp83N/profile.png", //https://via.placeholder.com/150?text=Upload+Image
    name: "John Doe",
    major: "Information Systems",
    class: "Sophomore",
    email: "jdoe1@andrew.cmu.edu",
    initialInterestsSkills: ["Web Development", "Open Source", "Hiking", "Photography"],
    initialBio: "Passionate about building scalable web applications and contributing to the developer community.",
    initialPreviousExperiences: [
      {
        id: "1",
        title: "Materials and Sciences Researcher",
        professorOrCompany: "Professor Name",
        topic: "Engineering",
        date: "2025/05/16",
        level: "Undergraduate",
        associatedTags: ["Circuits", "Material Engineering", "Programming", "Figma Knowledge"],
        description: "viverra sed cursus lorem. elit nibh placerat odio nibh ex dolor hendrerit ipsum elit lobortis, libero, enim. Nunc non quam consectetur ex non nibh quis tincidunt leo. Sed lacus, risus elit quam lacus, volutpat laoreet eget lacus nulla, Ut tincidunt nec risus venenatis ipsum at, ipsum ipsum nulla, sit amet, elit.",
      },
    ],
  },
};
