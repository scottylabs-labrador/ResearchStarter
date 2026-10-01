import AboutSection from "./AboutSection";
import Tag from "../Tag";
import Surface from "../ui/Surface";
import { Meta } from "../ui/Meta";

interface ResearchAreasSectionProps {
  tags: string[];
}

const ResearchAreasSection = ({ tags }: ResearchAreasSectionProps) => (
  <AboutSection title="Research areas" action={tags.length > 0 ? <Meta>{tags.length} listed</Meta> : null}>
    {tags.length > 0 ? (
      <Surface className="flex flex-wrap gap-1.5 p-4">
        {tags.map((tag) => (
          <Tag key={tag} keyword={tag} className="h-[26px]" />
        ))}
      </Surface>
    ) : (
      <Surface className="px-5 py-4">
        <p className="text-body text-ink-muted">No research areas listed yet.</p>
      </Surface>
    )}
  </AboutSection>
);

export default ResearchAreasSection;
