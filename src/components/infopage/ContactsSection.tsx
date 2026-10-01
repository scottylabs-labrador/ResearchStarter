import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import ContactCard from "./ContactCard";
import SectionLabel from "../ui/SectionLabel";

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

const ContactsSection: React.FC<ContactsSectionProps> = ({ contacts }) => (
  <section className="mt-14">
    <SectionLabel as="h2" className="mb-3">
      <PersonIcon sx={{ fontSize: 14 }} />
      Contacts
    </SectionLabel>
    <div className="scrollbar-minimal flex w-full gap-3 overflow-x-auto pb-2">
      {contacts.map((contact, index) => (
        <ContactCard key={index} {...contact} />
      ))}
    </div>
  </section>
);

export default ContactsSection;
