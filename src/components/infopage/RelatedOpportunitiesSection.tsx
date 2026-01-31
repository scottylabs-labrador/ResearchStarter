import React from 'react';
import OpportunityCard from './OpportunityCard';

interface Opportunity {
  opportunityName: string;
  isBookmarked: boolean;
  professorName: string;
  department: string;
  date: string;
  semester: string;
  tags: string[];
}

interface RelatedOpportunitiesSectionProps {
  opportunities: Opportunity[];
}

const RelatedOpportunitiesSection: React.FC<RelatedOpportunitiesSectionProps> = ({ opportunities }) => {
  return (
    <div className="w-screen ml-[calc(50%-50vw)] mb-8">
      <div className="bg-blue-50 p-6 rounded-lg px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Opportunities</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {opportunities.map((opportunity, index) => (
            <OpportunityCard
              key={index}
              opportunityName={opportunity.opportunityName}
              isBookmarked={opportunity.isBookmarked}
              onBookmarkToggle={() => console.log(`Bookmark toggled for ${opportunity.opportunityName}`)}
              professorName={opportunity.professorName}
              department={opportunity.department}
              date={opportunity.date}
              semester={opportunity.semester}
              tags={opportunity.tags}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedOpportunitiesSection;


