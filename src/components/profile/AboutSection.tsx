import React from "react";
import SectionLabel from "../ui/SectionLabel";
import { cx } from "../ui/cx";

interface AboutSectionProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const AboutSection = ({ title, action, children, className }: AboutSectionProps) => (
  <section className={cx("mt-10", className)}>
    <SectionLabel as="h2" action={action} className="mb-2">
      {title}
    </SectionLabel>
    {children}
  </section>
);
export default AboutSection;
