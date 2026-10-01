import React from "react";
import OpportunityCard from "./OpportunityCard";

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

const RelatedOpportunitiesSection: React.FC<RelatedOpportunitiesSectionProps> = ({ opportunities }) => (
  <section className="mt-14 border-t border-hairline pt-10">
    <h2 className="mb-5 text-heading text-ink">Related opportunities</h2>
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
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
  </section>
);

export default RelatedOpportunitiesSection;
