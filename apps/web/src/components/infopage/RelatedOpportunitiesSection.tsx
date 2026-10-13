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
      <div className="bg-brand-50 border-t border-gray-200 px-10 lg:px-16 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Related opportunities
        </h2>
        <div className="flex overflow-x-auto gap-4 px-6 py-6 -mx-6 -my-6">
          {opportunities.map((opportunity, index) => (
            <OpportunityCard
              key={index}
              opportunityName={opportunity.opportunityName}
              isBookmarked={opportunity.isBookmarked}
              onBookmarkToggle={() =>
                console.log(`Bookmark toggled for ${opportunity.opportunityName}`)
              }
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
