import React from "react";
import OpportunityCard from "./OpportunityCard";
import SectionLabel from "../ui/SectionLabel";

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
    <SectionLabel as="h2" className="mb-3">
      Related opportunities
    </SectionLabel>
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
