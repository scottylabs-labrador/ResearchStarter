import { ResearchType } from "../../DataTypes";
import Card from "../Card";
import SectionLabel from "../ui/SectionLabel";

interface RelatedOpportunitiesSectionProps {
  opportunities: ResearchType[];
}

const RelatedOpportunitiesSection = ({ opportunities }: RelatedOpportunitiesSectionProps) => (
  <section className="mt-14 border-t border-hairline pt-10">
    <SectionLabel as="h2" className="mb-2">
      Related opportunities
    </SectionLabel>
    <div className="flex flex-col gap-3">
      {opportunities.map((research) => (
        <Card key={research._id} research={research} />
      ))}
    </div>
  </section>
);

export default RelatedOpportunitiesSection;
