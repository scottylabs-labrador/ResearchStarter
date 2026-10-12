import React from 'react';
import ContactCard from './ContactCard';
import PersonIcon from '@mui/icons-material/Person';

interface Contact {
  headshotUrl: string;
  title: string;
  department: string;
  officeLocation: string;
  email: string;
}

interface ContactsSectionProps {
  contacts: Contact[];
}

const ContactsSection: React.FC<ContactsSectionProps> = ({ contacts }) => {
  return (
    <div className="bg-white px-6 lg:px-8 py-8 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <PersonIcon className="text-gray-700 text-3xl" />
        <h2 className="text-2xl font-bold text-gray-900">Contacts</h2>
      </div>
      <div className="flex w-full overflow-x-auto gap-4 pb-4">
        {contacts.map((contact, index) => (
          <ContactCard key={index} {...contact} />
        ))}
      </div>
    </div>
  );
};

export default ContactsSection;

