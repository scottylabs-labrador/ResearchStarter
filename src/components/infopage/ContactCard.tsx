import React from 'react';

interface ContactCardProps {
  headshotUrl: string;
  title: string;
  department: string;
  officeLocation: string;
  email: string;
}

const ContactCard: React.FC<ContactCardProps> = ({
  headshotUrl,
  title,
  department,
  officeLocation,
  email,
}) => {
  return (
    <div className="w-[13rem] h-[21rem] bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between">
      <img src={headshotUrl} alt={title} className="w-full h96 object-cover" />
      <div className="p-3 flex-grow">
        <h3 className="text-md font-semibold text-gray-900 leading-tight">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">{department}</p>
        <p className="text-gray-600 text-sm">{officeLocation}</p>
      </div>
      <div className="p-3 bg-gray-50 border-t border-gray-100">
        <a href={`mailto:${email}`} className="text-blue-500 hover:underline text-sm truncate block">
          {email}
        </a>
      </div>
    </div>
  );
};

export default ContactCard;

